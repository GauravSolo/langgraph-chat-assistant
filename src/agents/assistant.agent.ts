import { ChatCerebras } from "@langchain/cerebras";
import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { AIMessage } from "@langchain/core/messages";

const checkpointer = new MemorySaver();


const tavilyTool = new TavilySearch({
    maxResults: 5,
    topic: "general",
});

const tools = [tavilyTool];
const toolNode = new ToolNode(tools);

const llm = new ChatCerebras({
    model: "llama-3.3-70b",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
}).bindTools(tools);

const callModal = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
    return {
        messages: [response]
    };  
}

const shouldContinue = async (state: typeof MessagesAnnotation.State) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage instanceof AIMessage && lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        return "toolNode";
    }
    return "__end__";
}

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModal)
    .addNode("toolNode", toolNode)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__")
    .addEdge("toolNode", "agent")
    .addConditionalEdges("agent", shouldContinue);

export const agent = workflow.compile({checkpointer});
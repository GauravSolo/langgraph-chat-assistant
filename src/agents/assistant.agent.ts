import { ChatCerebras } from "@langchain/cerebras";
import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

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
    const lastMessage = state.messages.at(-1);
    
    // Type guard: check if message has tool_calls property
    const hasToolCalls =
        !!lastMessage &&
        "tool_calls" in lastMessage &&
        Array.isArray((lastMessage as any).tool_calls) &&
        (lastMessage as any).tool_calls.length > 0;

    if (hasToolCalls) {
        return "toolNode";
    }

    return "__end__";
}

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModal)
    .addNode("toolNode", toolNode)
    .addEdge("__start__", "agent")
    .addEdge("toolNode", "agent")
    .addConditionalEdges("agent", shouldContinue);

export const agent = workflow.compile({checkpointer});
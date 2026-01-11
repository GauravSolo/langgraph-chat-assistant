import { agent } from "@/agents/assistant.agent";
import { MessagesAnnotation } from "@langchain/langgraph";



export const assistantAgentService = async (message: typeof MessagesAnnotation.State) => {
    const result = await agent.invoke(message,{
        configurable: {
            "thread_id": "1",
        }
    });
    return result.messages[result.messages.length - 1].content;
};
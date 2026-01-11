import { assistantAgentService } from "@/services/agent.service";
import { NextResponse } from "next/server";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export async function POST(request: Request){
    const { message } = await request.json();    
    const response = await assistantAgentService({ messages: [new HumanMessage(message)] });
    return NextResponse.json({ message: response });
}
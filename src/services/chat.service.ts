export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export interface ChatResponse {
    message: string;
}

export const sendChatMessage = async (message: ChatMessage): Promise<string> => {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data.message;
};

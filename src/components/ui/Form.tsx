"use client";
import { Send, Bot, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { sendChatMessage, type ChatMessage } from "@/services/chat.service";

export const Form = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const userMessage = message.trim();
        if (!userMessage) return;

        setMessage("");
        setIsLoading(true);
        
        setMessages(prev => [...prev, {role: "user", content: userMessage}]);

        try {
            const response = await sendChatMessage({role: "user", content: userMessage});
            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: "Sorry, I encountered an error. Please try again." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] max-h-[900px] w-full max-w-3xl mx-auto bg-white dark:bg-gray-950 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                        <h1 className="text-base font-medium text-gray-900 dark:text-gray-100">AI Assistant</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-gray-50 dark:bg-gray-900">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-3">
                            <Bot className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                            Welcome
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                            Start a conversation by typing a message below
                        </p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.role === "assistant" && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                                msg.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {msg.content}
                            </p>
                        </div>
                        {msg.role === "user" && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2.5 border border-gray-200 dark:border-gray-700">
                            <div className="flex gap-1.5 items-center">
                                <div 
                                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
                                    style={{ animation: "typing-dot 1.4s infinite", animationDelay: "0ms" }}
                                />
                                <div 
                                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
                                    style={{ animation: "typing-dot 1.4s infinite", animationDelay: "200ms" }}
                                />
                                <div 
                                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
                                    style={{ animation: "typing-dot 1.4s infinite", animationDelay: "400ms" }}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-5 py-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input 
                        type="text" 
                        name="message" 
                        className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                        placeholder="Type a message..." 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    <button 
                        type="submit" 
                        className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        disabled={isLoading || !message.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

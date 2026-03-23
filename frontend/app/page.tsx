"use client";

import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import CodePanel from "@/components/CodePanel";
import { Message } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Here's your generated component — check the code panel →",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setCode(data.code ?? "");
    } catch (err) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `❌ Error: ${err instanceof Error ? err.message : "Something went wrong."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      <header className="h-12 border-b border-[#2a2a2a] flex items-center px-5 gap-3 shrink-0">
        <span className="text-purple-400 font-bold text-lg tracking-tight">⚡ BuildKaro</span>
        <span className="text-gray-600 text-xs">AI-powered app builder</span>
        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); setCode(""); }}
            className="ml-auto text-xs text-gray-500 hover:text-gray-300 border border-[#2a2a2a] hover:border-gray-500 px-3 py-1 rounded-md transition-colors"
          >
            New Chat
          </button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[40%] min-w-[300px] flex flex-col">
          <ChatPanel messages={messages} onSend={handleSend} isLoading={isLoading} />
        </div>
        <div className="flex-1 flex flex-col">
          <CodePanel code={code} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

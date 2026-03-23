"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";

interface ChatPanelProps {
  messages: Message[];
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatPanel({
  messages,
  onSend,
  isLoading,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#111] border-r border-[#2a2a2a]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-500" />
        <span className="text-sm font-semibold text-white">AI Chat</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-12 text-gray-500 text-sm space-y-2">
            <p className="text-2xl">✨</p>
            <p className="font-medium text-gray-400">What do you want to build?</p>
            <p>Describe a UI, component, or full app in plain English.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-purple-600 text-white rounded-br-sm"
                  : "bg-[#1e1e1e] text-gray-200 border border-[#2a2a2a] rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1e1e1e] border border-[#2a2a2a] px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-[#2a2a2a]">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Describe what you want to build..."
            rows={3}
            className="flex-1 resize-none bg-[#1e1e1e] border border-[#2a2a2a] text-white text-sm rounded-xl px-3 py-2.5 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-[#2a2a2a] disabled:text-gray-500 text-white text-sm font-medium rounded-xl transition-colors h-fit"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1.5">Shift+Enter for newline</p>
      </form>
    </div>
  );
}

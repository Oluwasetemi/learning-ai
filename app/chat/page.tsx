'use client';
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useChat } from "@ai-sdk/react";
import { Streamdown } from "streamdown";
import React, { useState, useRef, useEffect } from "react";

function ChatPage() {
  const [input, setInput] = useState<string>('');
  const { messages, sendMessage, error, stop, status } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input after AI response is complete
  useEffect(() => {
    if (status === "ready" && messages.length > 0) {
      // Small delay to ensure the response is fully rendered and scrolling is complete
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [status, messages.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            AI Chat Assistant
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Have a conversation with AI Models
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Messages Area */}
          <div className="overflow-y-auto p-6 space-y-4 h-[calc(100vh-410px)]">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-lg">
                    Start a conversation with AI
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        message.role === "user" ? "bg-blue-200" : "bg-green-400"
                      } ${message.role === "user" ? "ml-auto" : ""} `} />
                      <span className="text-xs font-medium opacity-70">
                        {message.role === "user" ? "You" : "AI"}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {message.parts.map((part, index) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <Streamdown key={index} isAnimating={status === "submitted"}>
                                {part.text}
                              </Streamdown>
                            );
                          default:
                            return null;
                        }
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Loading indicator */}
            {status === "streaming" && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-3 max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">AI</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-[0ms]"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <div className="flex-1">
                <Input
                  id="message"
                  type="text"
                  placeholder="Type your message here..."
                  autoFocus
                  autoComplete="off"
                  ref={(el) => {
                    inputRef.current = el;
                    if (el) {
                      el?.focus();
                    }
                  }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status === "streaming"}
                  className="w-full border-0 focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
              <div className="flex space-x-2">
                {status === "streaming" ? (
                  <Button
                    type="button"
                    onClick={() => stop()}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!input.trim() || status !== "ready"}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </Button>
                )}
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error?.message || "An error occurred. Please try again."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

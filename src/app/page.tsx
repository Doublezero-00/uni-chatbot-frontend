"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I am the Faculty of Technology AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      const finalContent =
        data.answer || data.error || "⚠️ Error: No response from server.";

      setMessages([...newMessages, { role: "bot", content: finalContent }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "bot",
          content:
            "⚠️ Sorry, I couldn't connect to the server. Please check if the Python backend is running.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 p-5 text-center shadow-sm">
          <h1 className="text-2xl font-bold tracking-wide text-white">
            Faculty AI Assistant
          </h1>
          <p className="text-sm text-blue-200 mt-1">
            University of Colombo - Faculty of Technology
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-600/90 text-white rounded-br-none"
                    : "bg-white/10 text-gray-100 rounded-bl-none border border-white/10 backdrop-blur-md"
                }`}
              >
                {/* ReactMarkdown vaprun UI format kele ahe */}
                {msg.role === "bot" ? (
                  <ReactMarkdown
                    components={{
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc ml-5 mt-2 space-y-1"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal ml-5 mt-2 space-y-1"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="leading-relaxed" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          className="mb-3 last:mb-0 leading-relaxed"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-semibold text-white"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {/* Loading Animation */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-100 rounded-2xl rounded-bl-none p-4 border border-white/10 backdrop-blur-md animate-pulse">
                Thinking... 🤔
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/10 backdrop-blur-md">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              placeholder="Ask anything about the faculty (e.g. Exam rules, Degrees)..."
              className="flex-1 bg-white/5 border border-white/20 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 font-semibold shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

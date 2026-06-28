"use client";

import { useState } from "react";

import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

export function ChatWindow() {
  const [messages, setMessages] =
    useState<any[]>([]);

  async function sendMessage(
    message: string
  ) {
    const res = await fetch(
      "/api/ai/chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          message,
        }),
      }
    );

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: data.answer,
      },
    ]);
  }

  return (
    <div className="space-y-4">
      <MessageList messages={messages} />

      <ChatInput
        onSend={sendMessage}
      />
    </div>
  );
}
"use client";

import { useState } from "react";

interface Props {
  onSend: (
    message: string
  ) => Promise<void>;
}

export function ChatInput({
  onSend,
}: Props) {
  const [message, setMessage] =
    useState("");

  return (
    <div className="flex gap-2">
      <input
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        className="flex-1 border rounded p-2"
        placeholder="Nachricht..."
      />

      <button
        className="border rounded px-4"
        onClick={async () => {
          if (!message.trim()) return;

          await onSend(message);

          setMessage("");
        }}
      >
        Send
      </button>
    </div>
  );
}
"use server";

import { openai } from "../services/openai.service";
import { buildSystemPrompt } from "../services/prompt.service";

export async function chatAction(message: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content: buildSystemPrompt(),
      },

      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.choices[0].message.content;
}
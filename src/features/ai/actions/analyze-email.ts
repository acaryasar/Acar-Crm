import { openai } from "@/features/ai/services/openai.service";

export async function analyzeEmail(
  subject: string,
  body: string
) {
  const response =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content:
            "Extract customer request and generate ticket data.",
        },

        {
          role: "user",
          content: `
SUBJECT:
${subject}

BODY:
${body}
`,
        },
      ],
    });

  return JSON.parse(
    response.choices[0].message.content ?? "{}"
  );
}
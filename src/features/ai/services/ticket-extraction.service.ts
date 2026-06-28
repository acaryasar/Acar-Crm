import { openai } from "./openai.service";

export async function extractTicket(
  text: string
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
          content: `
Extract ticket information.

Return JSON only.

{
 "title":"",
 "description":"",
 "priority":"LOW|MEDIUM|HIGH|URGENT",
 "appointment":""
}
`,
        },

        {
          role: "user",
          content: text,
        },
      ],
    });

  return JSON.parse(
    response.choices[0].message.content ||
      "{}"
  );
}
import OpenAI from 'openai';
import { AIProvider, AIResponse, AIProviderConfig } from './base-provider';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      baseURL: config.baseURL,
    });
    this.model = config.model || 'gpt-4o';
  }

  async processMessage(prompt: string, functions: any[], context?: any, userMessage?: string): Promise<AIResponse> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: prompt },
    ];

    if (context) {
      messages[0].content += `\n\nMevcut durum:\n${JSON.stringify(context, null, 2)}`;
    }

    if (userMessage) {
      messages.push({ role: 'user', content: userMessage });
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      functions,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0].message;

    if (assistantMessage.function_call) {
      return {
        content: assistantMessage.content || '',
        functionCall: {
          name: assistantMessage.function_call.name,
          arguments: assistantMessage.function_call.arguments,
        },
      };
    }

    return {
      content: assistantMessage.content || '',
    };
  }

  async processWithFunctionResult(
    prompt: string,
    functions: any[],
    functionCall: { name: string; arguments: string },
    functionResult: any,
    context?: any
  ): Promise<AIResponse> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: prompt },
    ];

    if (context) {
      messages[0].content += `\n\nMevcut durum:\n${JSON.stringify(context, null, 2)}`;
    }

    messages.push({
      role: 'assistant',
      content: null,
      function_call: functionCall,
    } as any);

    messages.push({
      role: 'function',
      name: functionCall.name,
      content: JSON.stringify(functionResult),
    });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.7,
    });

    return {
      content: response.choices[0].message.content || '',
    };
  }
}

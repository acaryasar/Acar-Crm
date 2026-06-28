export interface AIProvider {
  processMessage(prompt: string, functions: any[], context?: any, userMessage?: string): Promise<AIResponse>;
}

export interface AIResponse {
  content: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

export interface AIProviderConfig {
  type?: 'openai' | 'ollama' | 'mock';
  apiKey?: string;
  baseURL?: string;
  model?: string;
}

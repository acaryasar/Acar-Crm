import { AIProvider, AIProviderConfig } from './base-provider';
import { OpenAIProvider } from './openai-provider';
import { OllamaProvider } from './ollama-provider';
import { MockProvider } from './mock-provider';

export function createAIProvider(config?: AIProviderConfig): AIProvider {
  const providerType = config?.type || process.env.AI_PROVIDER || 'openai';

  switch (providerType) {
    case 'openai':
      return new OpenAIProvider(config || {});
    case 'ollama':
      return new OllamaProvider(config || {});
    case 'mock':
      return new MockProvider(config || {});
    default:
      console.warn(`Unknown provider type: ${providerType}, falling back to mock`);
      return new MockProvider(config || {});
  }
}

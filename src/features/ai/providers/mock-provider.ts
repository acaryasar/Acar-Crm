import { AIProvider, AIResponse, AIProviderConfig } from './base-provider';

export class MockProvider implements AIProvider {
  private step: number = 0;
  private state: any = {};

  constructor(config: AIProviderConfig) {
    // Mock provider doesn't need config
  }

  async processMessage(prompt: string, functions: any[], context?: any): Promise<AIResponse> {
    // Mock provider uses step-based logic
    // This is a simplified version - actual implementation will be in the agent
    return {
      content: 'Mock response',
    };
  }

  reset() {
    this.step = 0;
    this.state = {};
  }

  getStep(): number {
    return this.step;
  }

  setStep(step: number) {
    this.step = step;
  }

  getState(): any {
    return { ...this.state };
  }

  setState(key: string, value: any) {
    this.state[key] = value;
  }
}

import { BaseLLMProvider } from 'src/core/abstracts/base-llm.provider';

export class BedrockProvider extends BaseLLMProvider {
  chat(
    messages: string[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      functions?: { name: string; arguments: string }[];
    },
  ) {
    throw new Error('Method not implemented.');
  }
  getAvailableModels(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  validateApiKey(apiKey: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

import { BaseLLMProvider } from 'src/core/abstracts/base-llm.provider';
import { ChatMessage } from '../../core/interfaces/message.interface';
import { FunctionDefinition } from '../../core/interfaces/function.interface';

export class BedrockProvider extends BaseLLMProvider {
  chat(
    messages: ChatMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      functions?: FunctionDefinition[];
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

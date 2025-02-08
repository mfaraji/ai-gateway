import { ChatMessage } from '../interfaces/message.interface';
import { FunctionDefinition } from '../interfaces/function.interface';
export abstract class BaseLLMProvider {
  abstract chat(
    messages: ChatMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      functions?: FunctionDefinition[];
    },
  ): any;

  abstract getAvailableModels(): Promise<string[]>;

  abstract validateApiKey(apiKey: string): Promise<boolean>;

  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

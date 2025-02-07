export abstract class BaseLLMProvider {
  abstract chat(
    messages: string[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      functions?: {
        name: string;
        arguments: string;
      }[];
    },
  ): any;

  abstract getAvailableModels(): Promise<string[]>;

  abstract validateApiKey(apiKey: string): Promise<boolean>;

  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

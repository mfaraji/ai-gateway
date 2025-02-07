import { Injectable } from '@nestjs/common';
import { BaseLLMProvider } from '../../core/abstracts/base-llm.provider';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { ProviderError } from 'src/core/errors/provider-error';

@Injectable()
export class OpenAIProvider extends BaseLLMProvider {
  private openai: OpenAI;
  private readonly config: any;

  constructor(private configService: ConfigService) {
    super();
    this.config = configService.get('openai');
  }

  async onModuleInit() {
    try {
      this.openai = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseUrl,
        timeout: this.config.timeout,
        maxRetries: this.config.maxRetries,
      });
      await this.openai.models.list();
    } catch (error) {
      throw new ProviderError(
        `Failed to initialize OpenAI provider: \${error.message}`,
        'OpenAIProvider',
        error,
      );
    }
  }
  chat(
    messages: string[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      frequencyPenalty?: number;
      presencePenalty?: number;
    },
  ) {
    return this.openai.chat.completions.create({
      messages: messages.map((message) => ({
        role: 'user',
        content: message,
      })),
      model: options?.model || this.config.defaultModel,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 150,
      top_p: options?.topP || 1,
      frequency_penalty: options?.frequencyPenalty || 0,
      presence_penalty: options?.presencePenalty || 0,
    });
  }
  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.openai.models.list();
      return models.data.map((model) => model.id);
    } catch (error) {
      throw new ProviderError(
        `Failed to fetch OpenAI models: \${error.message}`,
        'OpenAIProvider',
        error,
      );
    }
  }
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const tmpClient = new OpenAI({ apiKey });
      await tmpClient.models.list();
      return true;
    } catch {
      return false;
    }
  }
}

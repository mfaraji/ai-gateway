import { Injectable } from '@nestjs/common';
import { BaseLLMProvider } from '../../core/abstracts/base-llm.provider';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { ProviderError } from 'src/core/errors/provider-error';
import { ChatMessage } from '../../core/interfaces/message.interface';
import { FunctionDefinition } from '../../core/interfaces/function.interface';

@Injectable()
export class OpenAIProvider extends BaseLLMProvider {
  private openai: OpenAI;
  private readonly config: any;
  private initialized = false;

  constructor(private configService: ConfigService) {
    super();
    this.config = configService.get('openai');
  }

  async initialize() {
    if (this.initialized) return;
    console.log('Initializing OpenAI client');
    try {
      this.openai = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseUrl,
        timeout: this.config.timeout || 5000,
        maxRetries: this.config.maxRetries || 3,
      });
      this.initialized = true;
    } catch (error) {
      throw new ProviderError(
        `Failed to initialize OpenAI provider: \${error.message}`,
        'OpenAIProvider',
        error,
      );
    }
  }
  async chat(
    messages: ChatMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      functions?: FunctionDefinition[];
    },
  ): Promise<any> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.openai.chat.completions.create({
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
        tool_call_id: message.tool_call_id,
      })),
      model: options?.model || this.config.defaultModel,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 150,
      top_p: options?.topP || 1,
      functions: options?.functions?.map((fn) => ({
        name: fn.name,
        description: fn.description,
        parameters: {
          type: 'object',
          properties: fn.parameters.properties,
          required: fn.parameters.required,
          additionalProperties: fn.parameters.additionalProperties,
        },
      })),
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

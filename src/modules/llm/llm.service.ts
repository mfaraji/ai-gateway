import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenAIProvider } from '../providers/openai.provider';
import { BedrockProvider } from '../providers/bedrock.provider';
import { ConfigService } from '@nestjs/config';
import { BaseLLMProvider } from 'src/core/abstracts/base-llm.provider';
import { ProviderEnum } from 'src/core/enums/provider-enum';
import { ProviderError } from 'src/core/errors/provider-error';

@Injectable()
export class LlmService implements OnModuleInit {
  private providers: Map<string, BaseLLMProvider> = new Map();
  private defaultProviderType: ProviderEnum;
  constructor(
    private openAIProvider: OpenAIProvider,
    private configService: ConfigService,
    private bedrockProvider: BedrockProvider,
  ) {}
  onModuleInit() {
    if (this.configService.get('openai.enabled')) {
      this.providers.set(ProviderEnum.OPENAI, this.openAIProvider);
    }
    if (this.configService.get('bedrock.enabled')) {
      this.providers.set(ProviderEnum.BEDROCK, this.bedrockProvider);
    }
    this.defaultProviderType = this.determineDefaultProvider();
  }
  determineDefaultProvider(): ProviderEnum {
    if (this.providers.has(ProviderEnum.OPENAI)) {
      return ProviderEnum.OPENAI;
    }
    if (this.providers.has(ProviderEnum.BEDROCK)) {
      return ProviderEnum.BEDROCK;
    }
    if (this.providers.has(ProviderEnum.GEMINI)) {
      return ProviderEnum.GEMINI;
    }
  }
  async chat(
    messages: string[],
    options?: {
      provider?: ProviderEnum;
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      functions?: { name: string; arguments: string }[];
    },
  ) {
    const provider = this.getProvider(
      options?.provider || this.defaultProviderType,
    );
    try {
      return await provider.chat(messages, {
        model: options?.model,
        maxTokens: options?.maxTokens,
        temperature: options?.temperature,
        topP: options?.topP,
        functions: options?.functions,
      });
    } catch (error) {
      if (error instanceof ProviderError) {
        throw error;
      }
      throw new ProviderError(
        `Failed to chat with provider ${provider.constructor.name}: ${error.message}`,
        provider.constructor.name,
        error,
      );
    }
  }
  private getProvider(providerType: ProviderEnum): BaseLLMProvider {
    const provider = this.providers.get(providerType);
    if (!provider) {
      throw new Error(`Provider ${providerType} is not enabled`);
    }
    return provider;
  }
  public async getAvailableModels(
    providerType: ProviderEnum,
  ): Promise<string[]> {
    const provider = this.providers.get(providerType);
    if (!provider) {
      throw new Error(`Provider ${providerType} is not enabled`);
    }
    return await provider.getAvailableModels();
  }

  public getEnabledProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  public getDefaultProvider(): string {
    return this.defaultProviderType;
  }
}

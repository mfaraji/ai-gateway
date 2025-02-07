import { Module } from '@nestjs/common';
import { OpenAIProvider } from './openai.provider';
import { BedrockProvider } from './bedrock.provider';

@Module({
  imports: [],
  providers: [OpenAIProvider, BedrockProvider],
  exports: [OpenAIProvider, BedrockProvider],
})
export class ProvidersModule {}

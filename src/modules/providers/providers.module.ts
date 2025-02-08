import { Module } from '@nestjs/common';
import { OpenAIProvider } from './openai.provider';
import { BedrockProvider } from './bedrock.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [OpenAIProvider, BedrockProvider],
  exports: [OpenAIProvider, BedrockProvider],
})
export class ProvidersModule {}

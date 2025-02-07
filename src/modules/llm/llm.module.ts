import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ConfigModule, ProvidersModule],
  providers: [LlmService],
  controllers: [LlmController],
})
export class LlmModule {}

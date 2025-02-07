import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmModule } from './modules/llm/llm.module';
import { AppConfigModule } from './config/config.module';
import { APP_PIPE } from '@nestjs/core';
import { ProvidersModule } from './modules/providers/providers.module';

@Module({
  imports: [LlmModule, AppConfigModule, ProvidersModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}

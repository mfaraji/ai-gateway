import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
} from '@nestjs/common';
import { LlmService } from './llm.service';
import { ChatRequestDto } from './dtos/chat-request.dto';
import { ChatResponseDto } from './dtos/chat-response.dto';
import { ValidateProvider } from 'src/core/decorators/validate-provider';
import { ProviderEnum } from 'src/core/enums/provider-enum';

@Controller('v1')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('chat/completions')
  chatCompletions(
    @Body() requestDto: ChatRequestDto,
    @Headers('x-provider') provider: string,
  ): Promise<ChatResponseDto> {
    return this.llmService.chat(requestDto.messages, {
      provider: provider as ProviderEnum,
      model: requestDto.model,
      maxTokens: requestDto.maxTokens,
      temperature: requestDto.temperature,
      topP: requestDto.topP,
      functions: requestDto.functions,
    });
  }

  @Get('models')
  getModels(
    @Query('provider') @ValidateProvider() provider: string,
  ): Promise<string[]> {
    try {
      return this.llmService.getAvailableModels(provider as ProviderEnum);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('providers')
  getProviders(): { providers: string[]; defaultProvider: string } {
    return {
      providers: this.llmService.getEnabledProviders(),
      defaultProvider: this.llmService.getDefaultProvider(),
    };
  }
}

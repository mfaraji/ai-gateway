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
    const messages = requestDto.messages.map((message) => ({
      role: message.role,
      content: message.content,
      tool_call_id: message.tool_call_id,
    }));
    const functions = requestDto.tools?.map((tool) => ({
      name: tool.function.name,
      description: tool.function.description,
      parameters: {
        type: tool.function.parameters.type,
        properties: tool.function.parameters.properties,
        required: tool.function.parameters.required,
        additionalProperties: tool.function.parameters.additionalProperties,
      },
    }));
    return this.llmService.chat(messages, {
      provider: provider as ProviderEnum,
      model: requestDto.model,
      maxTokens: requestDto.max_tokens,
      temperature: requestDto.temperature,
      functions: functions,
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

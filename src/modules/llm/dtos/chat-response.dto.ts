import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessageDto, ToolCallDto, UsageInfoDto } from './base.dto';

// ✅ Defines assistant response (including function calls)
export class ChatChoiceDto {
  @IsNumber()
  index: number;

  @ValidateNested()
  @Type(() => ChatMessageDto)
  message: ChatMessageDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolCallDto)
  tool_calls?: ToolCallDto[];

  @IsString()
  finish_reason: string;
}

// ✅ OpenAI Chat API Response DTO
export class ChatResponseDto {
  @IsString()
  id: string;

  @IsString()
  object: string;

  @IsNumber()
  created: number;

  @IsString()
  model: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatChoiceDto)
  choices: ChatChoiceDto[];

  @ValidateNested()
  @Type(() => UsageInfoDto)
  usage: UsageInfoDto;
}

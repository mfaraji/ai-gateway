import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsArray,
  IsObject,
  IsInt,
  IsPositive,
} from 'class-validator';
import { ChatRole } from './chat-request.dto';

export class FunctionCall {
  @IsString()
  name: string;

  @IsString()
  arguments: string;
}

export class ChatMessage {
  @IsEnum(ChatRole)
  role: ChatRole;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FunctionCall)
  function_call?: FunctionCall;
}

export enum FINISH_REASON {
  STOP = 'stop',
  LENGTH = 'length',
  FUNCTION_CALL = 'function_call',
  CONTENT_FILTER = 'content_filter',
}

export class ChatChoice {
  @IsNumber()
  @IsInt()
  @IsPositive()
  index: number;

  @ValidateNested()
  @Type(() => ChatMessage)
  message: ChatMessage;

  @IsOptional()
  @IsString()
  @IsEnum(FINISH_REASON)
  finish_reason?: FINISH_REASON;
}

export class UsageInfo {
  @IsNumber()
  @IsInt()
  @IsPositive()
  prompt_tokens: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  completion_tokens: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  total_tokens: number;
}

export class ChatResponseDto {
  @IsString()
  id: string;

  @IsString()
  object: string;

  @IsNumber()
  @IsPositive()
  created: number;

  @IsString()
  model: string;

  @IsString()
  provider: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatChoice)
  choices: ChatChoice[];

  @ValidateNested()
  @Type(() => UsageInfo)
  usage: UsageInfo;
}

export class ChatStreamChoice {
  @IsNumber()
  @IsInt()
  @IsPositive()
  index: number;

  @IsObject()
  delta: {
    @IsOptional()
    @IsEnum(ChatRole)
    role?: ChatRole;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => FunctionCall)
    function_call?: Partial<FunctionCall>;
  };

  @IsOptional()
  @IsString()
  @IsEnum(FINISH_REASON)
  finish_reason?: FINISH_REASON;
}

export class ChatStreamResponseDto {
  @IsString()
  id: string;

  @IsString()
  object: string;

  @IsNumber()
  @IsPositive()
  created: number;

  @IsString()
  model: string;

  @IsString()
  provider: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatStreamChoice)
  choices: ChatStreamChoice[];
}

export class ErrorResponseDto {
  @ValidateNested()
  @Type(() => ErrorDetail)
  error: ErrorDetail;
}

export class ErrorDetail {
  @IsString()
  message: string;

  @IsString()
  type: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  param?: string;
}
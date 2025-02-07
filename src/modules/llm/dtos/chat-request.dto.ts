import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';

export enum ChatRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  FUNCTION = 'function',
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
  functionCall?: {
    name: string;
    arguments: string;
  };
}

export class FunctionDefinition {
  @IsString()
  name: string;

  @IsString()
  description: string;

  parameters: Record<string, any>;
}

export class ChatRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ChatMessage)
  messages: ChatMessage[];

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4096)
  maxTokens?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  topP?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FunctionDefinition)
  functions?: FunctionDefinition[];

  @IsOptional()
  @IsString()
  functionCall?: string | 'auto' | 'none';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stop?: string[];

  @IsOptional()
  @IsNumber()
  @Min(-2)
  @Max(2)
  presencePenalty?: number;

  @IsOptional()
  @IsNumber()
  @Min(-2)
  @Max(2)
  frequencyPenalty?: number;

  @IsOptional()
  stream?: boolean;
}

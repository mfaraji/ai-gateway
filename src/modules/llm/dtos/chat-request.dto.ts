import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessageDto } from './base.dto';
import {
  FunctionDefinition,
  FunctionSchema,
} from '../../../core/interfaces/function.interface';

// ✅ Defines a function's schema
export class FunctionSchemaDto implements FunctionSchema {
  @IsString()
  type: string;

  @IsOptional()
  properties?: Record<string, any>; // Generic object for flexibility

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required?: string[];

  @IsOptional()
  @IsBoolean()
  additionalProperties?: boolean;
}

// ✅ Defines function metadata
export class FunctionDefinitionDto implements FunctionDefinition {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => FunctionSchemaDto)
  parameters: FunctionSchemaDto;
}

// ✅ Defines available tools (functions)
export class ToolDto {
  @IsString()
  type: string; // ✅ Currently, only "function" is allowed

  @IsOptional()
  @ValidateNested()
  @Type(() => FunctionDefinitionDto)
  function: FunctionDefinitionDto;
}

// ✅ OpenAI Chat API Request DTO
export class ChatRequestDto {
  @IsString()
  model: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  tools?: ToolDto[];

  @IsOptional()
  @IsString()
  tool_choice?: 'auto' | string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  max_tokens?: number;
}

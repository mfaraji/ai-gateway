import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatRole } from '../../../core/enums/chat-role-enum';
import { ChatMessage } from '../../../core/interfaces/message.interface';
import { FunctionCall } from '../../../core/interfaces/function.interface';

// ✅ Common DTO for Chat Messages (User, Assistant, or Tool)
export class ChatMessageDto implements ChatMessage {
  @IsEnum(ChatRole)
  role: ChatRole;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  tool_call_id?: string; // Required when role is 'function'
}

// ✅ Common DTO for Function Calls (Used in Requests and Responses)
export class FunctionCallDto implements FunctionCall {
  @IsString()
  name: string;

  @IsString()
  arguments: string; // JSON string containing function arguments
}

// ✅ Common DTO for Tool Calls (Assistant Function Call Requests)
export class ToolCallDto {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => FunctionCallDto)
  function: FunctionCallDto;
}

// ✅ Common DTO for Token Usage Info (Shared in Responses)
export class UsageInfoDto {
  @IsNumber()
  prompt_tokens: number;

  @IsNumber()
  completion_tokens: number;

  @IsNumber()
  total_tokens: number;
}

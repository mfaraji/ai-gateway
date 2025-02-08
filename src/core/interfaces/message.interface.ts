import { ChatRole } from '../enums/chat-role-enum';

export interface ChatMessage {
  role: ChatRole;
  content?: string;
  tool_call_id?: string; // Required when role is 'function'
}

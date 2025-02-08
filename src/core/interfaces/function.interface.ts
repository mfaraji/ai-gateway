export interface FunctionCall {
  name: string;

  arguments: string; // JSON string containing function arguments
}

export interface FunctionDefinition {
  name: string;

  description?: string;

  parameters: FunctionSchema;
}

export interface FunctionSchema {
  type: string;

  description?: string;

  properties?: Record<string, any>; // Generic object for flexibility

  required?: string[];

  additionalProperties?: boolean;
}

export interface LLMProviderConfig {
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  rateLimit: {
    burstLimit: number;
    requestsPerMinute: number;
  };
}
export interface Config {
  port?: number;
  environment?: 'development' | 'production' | 'test';
  openai: LLMProviderConfig & {
    defaultModel: string;
    modelsConfig: {
      [key: string]: {
        maxTokens: number;
        temperature: number;
        topP: number;
        frequencyPenalty: number;
        presencePenalty: number;
      };
    };
  };
  bedrock: LLMProviderConfig & {
    aws: {
      region: string;
      credentials: {
        accessKeyId: string;
        secretAccessKey: string;
      };
    };
    defaultModel: string;
    modelsConfig: {
      [key: string]: {
        maxTokens: number;
        temperature: number;
      };
    };
  };
  gemini: LLMProviderConfig & {
    projectId?: string;
    defaultModel: string;
    modelsConfig: {
      [key: string]: {
        maxOutputTokens: number;
        temperature: number;
        topK: number;
        topP: number;
      };
    };
  };
}

export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
  openai: {
    enabled: process.env.OPENAI_ENABLED === 'true',
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_BASE_URL,
    timeout: parseInt(process.env.OPENAI_TIMEOUT, 10),
    maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES, 10),
    rateLimit: {
      burstLimit: parseInt(process.env.OPENAI_RATE_LIMIT_BURST, 10),
      requestsPerMinute: parseInt(process.env.OPENAI_RATE_LIMIT_RPM, 10),
    },
    defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'text-davinci-003',
    modelsConfig: {
      'gpt-4': {
        maxTokens: 8192,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      'gpt-4-turbo': {
        maxTokens: 4096,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      o1: {
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.95,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      'o1-mini': {
        maxTokens: 2048,
        temperature: 0.7,
        topP: 0.95,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },
  },
  bedrock: {
    enabled: process.env.BEDROCK_ENABLED === 'true',
    apiKey: process.env.BEDROCK_API_KEY,
    baseUrl: process.env.BEDROCK_BASE_URL,
    timeout: parseInt(process.env.BEDROCK_TIMEOUT, 10),
    maxRetries: parseInt(process.env.BEDROCK_MAX_RETRIES, 10),
    rateLimit: {
      burstLimit: parseInt(process.env.BEDROCK_RATE_LIMIT_BURST, 10),
      requestsPerMinute: parseInt(process.env.BEDROCK_RATE_LIMIT_RPM, 10),
    },
    aws: {
      region: process.env.BEDROCK_AWS_REGION,
      credentials: {
        accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY,
      },
    },
    defaultModel:
      process.env.BEDROCK_DEFAULT_MODEL || 'amazon.titan-text-express-v1',
    modelsConfig: {
      'amazon.titan-text-express-v1': {
        maxTokens: 4096,
        temperature: 0.7,
      },
    },
  },
  gemini: {
    enabled: process.env.GEMINI_ENABLED === 'true',
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: process.env.GEMINI_BASE_URL,
    projectId: process.env.GEMINI_PROJECT_ID,
    timeout: parseInt(process.env.GEMINI_TIMEOUT || '30000', 10),
    maxRetries: parseInt(process.env.GEMINI_MAX_RETRIES || '3', 10),
    defaultModel: process.env.GEMINI_DEFAULT_MODEL || 'gemini-pro',
    rateLimit: {
      requestsPerMinute: parseInt(
        process.env.GEMINI_REQUESTS_PER_MINUTE || '60',
        10,
      ),
      burstLimit: parseInt(process.env.GEMINI_BURST_LIMIT || '20', 10),
    },
    modelsConfig: {
      'gemini-pro': {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    },
  },
});

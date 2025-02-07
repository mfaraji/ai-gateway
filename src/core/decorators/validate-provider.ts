import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ProviderEnum } from '../enums/provider-enum';

export const ValidateProvider = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const provider = request.provider;
    if (!provider) {
      return undefined;
    }
    if (!Object.values(ProviderEnum).includes(provider as ProviderEnum)) {
      throw new BadRequestException(
        `Invalid provider. Must be one of: \${Object.values(ProviderEnum).join(', ')}`,
      );
    }
    return provider;
  },
);

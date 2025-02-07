import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}
  get port(): number {
    return this.configService.get<number>('port');
  }
  get environment(): string {
    return this.configService.get<string>('environment');
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env.\${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
      cache: true,
    }),
  ],
})
export class AppConfigModule {}

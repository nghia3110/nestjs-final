import { Module } from '@nestjs/common';

import { PostgresqlModule } from './database';
import { UploadsModule, UsersModule } from './modules';
import { IoRedisModule } from './utils';
import { AppController } from './app.controller';

@Module({
  imports: [IoRedisModule, UploadsModule, UsersModule, PostgresqlModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

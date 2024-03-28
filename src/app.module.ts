import { Module } from '@nestjs/common';

import { PostgresqlModule } from './database';
import { UploadsModule, UsersModule } from './modules';
import { IoRedisModule } from './utils';
import { AppController } from './app.controller';
import { RanksModule } from './modules/ranks/ranks.module';

@Module({
  imports: [
    IoRedisModule,
    UploadsModule,
    UsersModule,
    RanksModule,
    PostgresqlModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }

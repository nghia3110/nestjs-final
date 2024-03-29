import { Module } from '@nestjs/common';

import { PostgresqlModule } from './database';
import { UploadsModule, UsersModule } from './modules';
import { IoRedisModule } from './utils';
import { AppController } from './app.controller';
import { RanksModule } from './modules/ranks/ranks.module';
import { StoresModule } from './modules/stores/stores.module';
import { MethodsModule } from './modules/methods/methods.module';

@Module({
  imports: [
    IoRedisModule,
    UploadsModule,
    UsersModule,
    StoresModule,
    MethodsModule,
    RanksModule,
    PostgresqlModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }

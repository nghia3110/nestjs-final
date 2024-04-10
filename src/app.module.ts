import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { PostgresqlModule } from './database';
import {
  ItemsModule,
  MethodDetailsModule,
  MethodsModule,
  OrderDetailsModule,
  OrdersModule,
  StoresModule,
  UploadsModule,
  UsersModule
} from './modules';
import { RanksModule } from './modules/ranks/ranks.module';
import { IoRedisModule } from './utils';
import { RedeemItemsModule } from './modules/redeem-items';


@Module({
  imports: [
    IoRedisModule,
    UploadsModule,
    UsersModule,
    StoresModule,
    MethodsModule,
    RanksModule,
    OrdersModule,
    OrderDetailsModule,
    MethodDetailsModule,
    ItemsModule,
    RedeemItemsModule,
    PostgresqlModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }

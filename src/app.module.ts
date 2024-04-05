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
  UsersModule,
} from './modules';
import { RanksModule } from './modules/ranks/ranks.module';
import { IoRedisModule } from './utils';
import { RedeemItemsModule } from './modules/redeem-items';
import { SmsModule } from './modules/sms/sms.module';


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
    PostgresqlModule,
    SmsModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }

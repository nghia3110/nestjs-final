import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from 'src/database';

import { ItemsModule } from '../items';
import { MethodsModule } from '../methods/methods.module';
import { OrdersModule } from '../orders';
import { RedeemItemsModule } from '../redeem-items';
import { UserOrderModule } from '../user-order';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Store]),
        OrdersModule,
        UserOrderModule,
        MethodsModule,
        ItemsModule,
        RedeemItemsModule
    ],
    controllers: [StoresController],
    providers: [StoresService, StoresRepository],
    exports: [StoresService],
})
export class StoresModule { }

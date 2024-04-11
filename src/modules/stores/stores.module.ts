import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from 'src/database';

import { ItemsModule } from '../items';
import { MethodsModule } from '../methods';
import { OrdersModule } from '../orders';
import { RedeemItemsModule } from '../redeem-items';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';
import { UsersModule } from '../users';
import { MethodDetailsModule } from '../method-details';

@Module({
    imports: [
        SequelizeModule.forFeature([Store]),
        MethodsModule,
        MethodDetailsModule,
        ItemsModule,
        RedeemItemsModule,
        OrdersModule,
        UsersModule
    ],
    controllers: [StoresController],
    providers: [StoresService, StoresRepository],
    exports: [StoresService],
})
export class StoresModule { }

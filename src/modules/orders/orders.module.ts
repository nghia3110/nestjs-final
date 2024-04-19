import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Order } from 'src/database';
import { ItemsModule } from '../items';
import { OrderDetailsModule } from '../order-details';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Order]),
        OrderDetailsModule,
        ItemsModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository],
    exports: [OrdersService],
})
export class OrdersModule { }

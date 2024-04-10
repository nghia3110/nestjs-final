import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Order } from 'src/database';
import { OrderDetailsModule } from '../order-details/order-details.module';
import { UsersModule } from '../users';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { ItemsModule } from '../items';

@Module({
    imports: [
        SequelizeModule.forFeature([Order]),
        forwardRef(() => UsersModule),
        forwardRef(() => OrderDetailsModule),
        ItemsModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository],
    exports: [OrdersService],
})
export class OrdersModule { }

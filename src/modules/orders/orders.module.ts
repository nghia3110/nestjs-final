import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Order } from 'src/database';
import { OrderDetailsModule } from '../orderdetails/order-details.module';
import { UsersModule } from '../users';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Order]),
        forwardRef(() => UsersModule),
        forwardRef(() => OrderDetailsModule)
    ],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository],
    exports: [OrdersService],
})
export class OrdersModule { }

import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { OrderDetail } from 'src/database';
import { ItemsModule } from '../items';
import { OrdersModule } from '../orders';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsRepository } from './order-details.repository';
import { OrderDetailsService } from './order-details.service';

@Module({
    imports: [
        SequelizeModule.forFeature([OrderDetail]),
        forwardRef(() => ItemsModule),
        forwardRef(() => OrdersModule),
    ],
    controllers: [OrderDetailsController],
    providers: [OrderDetailsService, OrderDetailsRepository],
    exports: [OrderDetailsService],
})
export class OrderDetailsModule { }

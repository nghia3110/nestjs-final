import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { OrderDetail } from 'src/database';
import { ItemsModule } from '../items';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsRepository } from './order-details.repository';
import { OrderDetailsService } from './order-details.service';

@Module({
    imports: [
        SequelizeModule.forFeature([OrderDetail]),
        ItemsModule,
    ],
    controllers: [OrderDetailsController],
    providers: [OrderDetailsService, OrderDetailsRepository],
    exports: [OrderDetailsService],
})
export class OrderDetailsModule { }

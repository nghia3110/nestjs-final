import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RedeemItemsRepository } from './redeem-items.repository';
import { RedeemItemsService } from './redeem-items.service';
import { RedeemItem } from 'src/database';
import { RedeemItemsController } from './redeem-items.controller';

@Module({
    imports: [
        SequelizeModule.forFeature([RedeemItem]),
    ],
    controllers: [RedeemItemsController],
    providers: [RedeemItemsService, RedeemItemsRepository],
    exports: [RedeemItemsService],
})
export class RedeemItemsModule { }

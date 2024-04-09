import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Redeem } from 'src/database';
import { RedeemsController } from './redeems.controller';
import { RedeemsRepository } from './redeems.repository';
import { RedeemsService } from './redeems.service';
import { RedeemItemsModule } from '../redeem-items';
import { RedeemDetailsModule } from '../redeem-details';

@Module({
    imports: [
        SequelizeModule.forFeature([Redeem]),
        RedeemItemsModule,
        RedeemDetailsModule
    ],
    controllers: [RedeemsController],
    providers: [RedeemsService, RedeemsRepository],
    exports: [RedeemsService],
})
export class RedeemsModule { }

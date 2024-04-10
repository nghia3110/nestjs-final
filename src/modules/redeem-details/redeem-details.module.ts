import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RedeemDetail } from 'src/database';
import { RedeemItemsModule } from '../redeem-items';
import { RedeemDetailsController } from './redeem-details.controller';
import { RedeemDetailsRepository } from './redeem-details.repository';
import { RedeemDetailsService } from './redeem-details.service';

@Module({
    imports: [
        SequelizeModule.forFeature([RedeemDetail]),
        RedeemItemsModule,
    ],
    controllers: [RedeemDetailsController],
    providers: [RedeemDetailsService, RedeemDetailsRepository],
    exports: [RedeemDetailsService],
})
export class RedeemDetailsModule { }

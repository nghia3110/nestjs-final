import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MethodDetail } from 'src/database';

import { MethodDetailsRepository } from './method-details.repository';
import { MethodDetailsService } from './method-details.service';
import { MethodsModule } from '../methods';
import { RanksModule } from '../ranks/ranks.module';
import { MethodDetailsController } from './method-details.controller';

@Module({
    imports: [
        SequelizeModule.forFeature([MethodDetail]),
        MethodsModule,
        RanksModule
    ],
    controllers: [MethodDetailsController],
    providers: [MethodDetailsService, MethodDetailsRepository],
    exports: [MethodDetailsService],
})
export class MethodDetailsModule { }

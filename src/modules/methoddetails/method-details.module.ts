import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MethodDetail } from 'src/database';

import { MethodDetailsRepository } from './method-details.repository';
import { MethodDetailsService } from './method-details.service';

@Module({
    imports: [SequelizeModule.forFeature([MethodDetail])],
    controllers: [],
    providers: [MethodDetailsService, MethodDetailsRepository],
    exports: [MethodDetailsService],
})
export class MethodDetailsModule { }

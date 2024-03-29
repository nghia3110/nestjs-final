import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccumulateMethod } from 'src/database';

import { MethodsRepository } from './methods.repository';
import { MethodsService } from './methods.service';

@Module({
    imports: [SequelizeModule.forFeature([AccumulateMethod])],
    controllers: [],
    providers: [MethodsService, MethodsRepository],
    exports: [MethodsService],
})
export class MethodsModule { }

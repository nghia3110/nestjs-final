import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccumulateMethod } from 'src/database';

import { MethodsRepository } from './methods.repository';
import { MethodsService } from './methods.service';
import { MethodsController } from './methods.controller';

@Module({
    imports: [SequelizeModule.forFeature([AccumulateMethod])],
    controllers: [MethodsController],
    providers: [MethodsService, MethodsRepository],
    exports: [MethodsService],
})
export class MethodsModule { }

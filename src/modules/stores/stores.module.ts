import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from 'src/database';

import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';
import { MethodsModule } from '../methods/methods.module';
import { StoresController } from './stores.controller';
import { OrdersModule } from '../orders';
import { UsersModule } from '../users';
import { MethodDetailsModule } from '../methoddetails';

@Module({
    imports: [
        SequelizeModule.forFeature([Store]),
        MethodsModule,
        OrdersModule,
        UsersModule, 
        MethodDetailsModule
    ],
    controllers: [StoresController],
    providers: [StoresService, StoresRepository],
    exports: [StoresService],
})
export class StoresModule { }

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';
import { Item } from 'src/database';
import { StoresModule } from '../stores/stores.module';
import { ItemsController } from './items.controller';

@Module({
    imports: [
        SequelizeModule.forFeature([Item]),
        StoresModule
    ],
    controllers: [ItemsController],
    providers: [ItemsService, ItemsRepository],
    exports: [ItemsService],
})
export class ItemsModule { }

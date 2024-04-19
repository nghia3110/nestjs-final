import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Item } from 'src/database';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';
import { UploadsModule } from '../uploads';

@Module({
    imports: [
        SequelizeModule.forFeature([Item]),
        UploadsModule
    ],
    controllers: [ItemsController],
    providers: [ItemsService, ItemsRepository],
    exports: [ItemsService],
})
export class ItemsModule { }

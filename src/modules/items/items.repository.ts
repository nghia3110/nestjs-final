import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, Item } from 'src/database';

@Injectable()
export class ItemsRepository extends BaseRepository<Item> {
  constructor(@InjectModel(Item) readonly model: typeof Item) {
    super(model);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, Store } from 'src/database';

@Injectable()
export class StoresRepository extends BaseRepository<Store> {
  constructor(@InjectModel(Store) readonly model: typeof Store) {
    super(model);
  }
}

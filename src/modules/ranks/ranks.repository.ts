import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, Rank } from 'src/database';

@Injectable()
export class RanksRepository extends BaseRepository<Rank> {
  constructor(@InjectModel(Rank) readonly model: typeof Rank) {
    super(model);
  }
}

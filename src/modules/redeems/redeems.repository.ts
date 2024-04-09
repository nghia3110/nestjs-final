import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Redeem, BaseRepository } from 'src/database';

@Injectable()
export class RedeemsRepository extends BaseRepository<Redeem> {
  constructor(@InjectModel(Redeem) readonly model: typeof Redeem) {
    super(model);
  }
}

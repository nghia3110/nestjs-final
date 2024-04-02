import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, RedeemItem } from 'src/database';

@Injectable()
export class RedeemItemsRepository extends BaseRepository<RedeemItem> {
  constructor(@InjectModel(RedeemItem) readonly model: typeof RedeemItem) {
    super(model);
  }
}

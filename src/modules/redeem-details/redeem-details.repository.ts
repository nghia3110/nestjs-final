import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, RedeemDetail } from 'src/database';

@Injectable()
export class RedeemDetailsRepository extends BaseRepository<RedeemDetail> {
  constructor(@InjectModel(RedeemDetail) readonly model: typeof RedeemDetail) {
    super(model);
  }
}

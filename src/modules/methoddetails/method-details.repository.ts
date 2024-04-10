import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, MethodDetail } from 'src/database';

@Injectable()
export class MethodDetailsRepository extends BaseRepository<MethodDetail> {
  constructor(@InjectModel(MethodDetail) readonly model: typeof MethodDetail) {
    super(model);
  }
}

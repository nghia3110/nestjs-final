import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, OrderDetail } from 'src/database';

@Injectable()
export class OrderDetailsRepository extends BaseRepository<OrderDetail> {
  constructor(@InjectModel(OrderDetail) readonly model: typeof OrderDetail) {
    super(model);
  }
}

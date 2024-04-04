import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, BaseRepository } from 'src/database';

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
  constructor(@InjectModel(Order) readonly model: typeof Order) {
    super(model);
  }
}

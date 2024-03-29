import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccumulateMethod, BaseRepository } from 'src/database';

@Injectable()
export class MethodsRepository extends BaseRepository<AccumulateMethod> {
  constructor(@InjectModel(AccumulateMethod) readonly model: typeof AccumulateMethod) {
    super(model);
  }
}

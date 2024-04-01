import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rank } from 'src/database';

import { RanksRepository } from './ranks.repository';
import { RanksService } from './ranks.service';

@Module({
  imports: [SequelizeModule.forFeature([Rank])],
  controllers: [],
  providers: [RanksService, RanksRepository],
  exports: [RanksService],
})
export class RanksModule {}

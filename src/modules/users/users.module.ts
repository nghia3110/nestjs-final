import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database';

import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { RanksModule } from '../ranks/ranks.module';
import { OrdersModule } from '../orders';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    RanksModule,
    forwardRef(() => OrdersModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

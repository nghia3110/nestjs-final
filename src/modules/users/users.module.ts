import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database';

import { RanksModule } from '../ranks/ranks.module';
import { RedeemsModule } from '../redeems';
import { SmsModule } from '../sms/sms.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { RedeemItemsModule } from '../redeem-items';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    RanksModule,
    SmsModule,
    RedeemsModule,
    RedeemItemsModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
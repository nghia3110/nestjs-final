import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { Rank } from './ranks.model';
import { Order } from './orders.model';
import { Redeem } from './redeem.model';
import { BaseModel } from '../base.model';

@Table({
  tableName: 'users',
  underscored: true,
})
export class User extends BaseModel {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({
    unique: true
  })
  phoneNumber: string;

  @Column
  password: string;

  @Column({
    unique: true
  })
  email: string;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  totalPoints: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  currentPoints: number;

  @Column({ defaultValue: false })
  isAdmin: boolean;

  @Column({ defaultValue: false })
  isVerified: boolean;

  @ForeignKey(() => Rank)
  @Column({
    type: DataType.UUID
  })
  rankId: string;

  @BelongsTo(() => Rank)
  rank: Rank;

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => Redeem)
  redeems: Redeem[];
}
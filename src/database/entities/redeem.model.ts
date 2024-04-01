import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";
import { RedeemItem } from "./redeem-items.model";
import { RedeemDetail } from "./redeem-details.model";
import { BaseModel } from "../base.model";

@Table({
    tableName: 'redeem',
    underscored: true
})
export class Redeem extends BaseModel {
    @Column
    status: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => RedeemItem, () => RedeemDetail)
    redeemItems: RedeemItem[];
}
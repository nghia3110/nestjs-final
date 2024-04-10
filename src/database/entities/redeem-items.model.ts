import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Item } from "./items.model";
import { RedeemDetail } from "./redeem-details.model";
import { Redeem } from "./redeem.model";
import { BaseModel } from "../base.model";

@Table({
    tableName: 'redeem_items',
    underscored: true
})
export class RedeemItem extends BaseModel {
    @Column({
        type: DataType.DOUBLE
    })
    exchange_point: number;

    @Column
    expiredTime: Date

    @Column({
        type: DataType.INTEGER
    })
    quantity: number;

    @ForeignKey(() => Item)
    @Column({
        type: DataType.UUID
    })
    itemId: string;

    @BelongsTo(() => Item)
    item: Item;

    @BelongsToMany(() => Redeem, () => RedeemDetail)
    redeems: Redeem[];
}
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Item } from "./items.model";
import { RedeemDetail } from "./redeem-details.model";
import { Redeem } from "./redeem.model";
import { BaseModel } from "../base.model";
import { Store } from "./stores.model";

@Table({
    tableName: 'redeem_items',
    underscored: true
})
export class RedeemItem extends BaseModel {
    @Column
    name: string;

    @Column
    photo: string;

    @Column
    description: string;

    @Column({
        type: DataType.DOUBLE
    })
    exchangePoint: number;

    @Column
    expiredTime: Date

    @Column({
        type: DataType.INTEGER
    })
    quantity: number;

    @ForeignKey(() => Store)
    @Column({
        type: DataType.UUID
    })
    storeId: string;

    @BelongsTo(() => Store)
    store: Store;

    @BelongsToMany(() => Redeem, () => RedeemDetail)
    redeems: Redeem[];
}
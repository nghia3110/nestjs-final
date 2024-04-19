import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Redeem } from "./redeem.model";
import { RedeemItem } from "./redeem-items.model";
import { BaseModel } from "../base.model";
import { EStatus } from "src/constants";

@Table({
    tableName: 'redeem_details',
    underscored: true
})
export class RedeemDetail extends BaseModel {
    @ForeignKey(() => Redeem)
    @Column({
        type: DataType.UUID
    })
    redeemId: string;

    @ForeignKey(() => RedeemItem)
    @Column({
        type: DataType.UUID
    })
    itemId: string;

    @Column({
        type: DataType.INTEGER
    })
    quantityRedeem: number;

    @Column({
        type: DataType.STRING,
        defaultValue: EStatus.PENDING
    })
    status: string;

    @BelongsTo(() => Redeem)
    redeem: Redeem;

    @BelongsTo(() => RedeemItem)
    item: RedeemItem;
}
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Redeem } from "./redeem.model";
import { RedeemItem } from "./redeem-items.model";

@Table({
    tableName: 'redeem_details',
    underscored: true
})
export class RedeemDetail extends Model {
    @Column({
        type: DataType.UUID
    })
    redeemId: string;

    @ForeignKey(() => RedeemItem)
    @Column({
        type: DataType.UUID
    })
    itemId: string;

    @ForeignKey(() => Redeem)
    @Column({
        type: DataType.INTEGER
    })
    quantityRedeem: number;
}
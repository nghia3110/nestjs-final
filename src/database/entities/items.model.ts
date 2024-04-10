import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { Store } from "./stores.model";
import { RedeemItem } from "./redeem-items.model";
import { Order } from "./orders.model";
import { OrderDetail } from "./order-details.model";
import { BaseModel } from "../base.model";

@Table({
    tableName: 'items',
    underscored: true
})
export class Item extends BaseModel {
    @Column
    name: string;

    @Column({
        type: DataType.DOUBLE
    })
    price: number;

    @Column({
        type: DataType.INTEGER
    })
    quantityInStock: number;

    @Column
    photo: string;

    @Column
    description: string;

    @ForeignKey(() => Store)
    @Column({
        type: DataType.UUID
    })
    storeId: string;

    @BelongsTo(() => Store)
    store: Store;

    @HasOne(() => RedeemItem)
    redeemItem: RedeemItem;

    @BelongsToMany(() => Order, () => OrderDetail)
    orders: Order[];
}
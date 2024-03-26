import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";
import { OrderDetail } from "./order-details.model";
import { Item } from "./items.model";
import { BaseModel } from "../base.model";

@Table({
    tableName: 'orders',
    underscored: true
})
export class Order extends BaseModel {
    @Column
    status: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => Item, () => OrderDetail)
    items: Item[];
}
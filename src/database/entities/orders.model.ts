import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";
import { OrderDetail } from "./order-details.model";
import { Item } from "./items.model";
import { BaseModel } from "../base.model";
import { Store } from "./stores.model";
import { EStatus } from "src/constants";

@Table({
    tableName: 'orders',
    underscored: true
})
export class Order extends BaseModel {
    @Column({
        defaultValue: EStatus.PENDING
    })
    status: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    userId: string;

    @ForeignKey(() => Store)
    @Column({
        type: DataType.UUID
    })
    storeId: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Store)
    store: Store;

    @BelongsToMany(() => Item, () => OrderDetail)
    items: Item[];
}
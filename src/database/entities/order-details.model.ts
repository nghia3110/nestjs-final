import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Order } from "./orders.model";
import { Item } from "./items.model";

@Table({
    tableName: 'order_details',
    underscored: true
})
export class OrderDetail extends Model {
    @Column({
        type: DataType.INTEGER
    })
    quantityOrdered: number;

    @ForeignKey(() => Order)
    @Column({
        type: DataType.UUID
    })
    orderId: string;

    @ForeignKey(() => Item)
    @Column({
        type: DataType.UUID
    })
    itemId: string;
}
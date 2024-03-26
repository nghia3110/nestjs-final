import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { AccumulateMethod } from "./accumulate-methods.model";
import { Item } from "./items.model";
import { BaseModel } from "../base.model";

@Table({
    tableName: 'stores',
    underscored: true
})
export class Store extends BaseModel {
    @Column
    name: string;

    @Column
    email: string;

    @Column
    password: string;

    @Column
    address: string;

    @Column
    phoneNumber: string;

    @Column({
        defaultValue: false
    })
    isVerified: boolean;

    @Column({
        defaultValue: false
    })
    isApproved: boolean;

    @ForeignKey(() => AccumulateMethod)
    @Column({
        type: DataType.UUID
    })
    methodId: string;

    @BelongsTo(() => AccumulateMethod)
    method: AccumulateMethod;

    @HasMany(() => Item)
    items: Item[];
}
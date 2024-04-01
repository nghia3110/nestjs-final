import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { AccumulateMethod } from "./accumulate-methods.model";
import { Rank } from "./ranks.model";
import { BaseModel } from "../base.model";

@Table({
    tableName: 'method_details',
    underscored: true
})
export class MethodDetail extends BaseModel {
    @Column({
        type: DataType.DOUBLE
    })
    fixedPoint: number;

    @Column({
        type: DataType.DOUBLE
    })
    maxPoint: number;

    @Column({
        type: DataType.DOUBLE
    })
    percentage: number;

    @ForeignKey(() => AccumulateMethod)
    @Column({
        type: DataType.UUID
    })
    methodId: string;

    @ForeignKey(() => Rank)
    @Column({
        type: DataType.UUID
    })
    rankId: string;

    @BelongsTo(() => AccumulateMethod)
    method: AccumulateMethod;

    @BelongsTo(() => Rank)
    rank: Rank;
}
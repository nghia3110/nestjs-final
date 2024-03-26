import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";
import { MethodDetail } from "./method-details.model";
import { AccumulateMethod } from "./accumulate-methods.model";

@Table({
    tableName: 'ranks',
    underscored: true
})
export class Rank extends Model {
    @Column
    name: string;

    @Column({
        type: DataType.DOUBLE
    })
    promotePoint: number;

    @HasMany(() => User)
    users: User[];

    @BelongsToMany(() => AccumulateMethod, () => MethodDetail)
    methods: AccumulateMethod[];
}
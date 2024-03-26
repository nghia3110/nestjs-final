import { BelongsToMany, Column, HasMany, Model, Table } from "sequelize-typescript";
import { Store } from "./stores.model";
import { MethodDetail } from "./method-details.model";
import { Rank } from "./ranks.model";

@Table({
    tableName: 'accumulate_methods',
    underscored: true
})
export class AccumulateMethod extends Model {
    @Column
    name: string;

    @HasMany(() => Store)
    stores: Store[];

    @BelongsToMany(() => Rank, () => MethodDetail)
    ranks: Rank[];
}
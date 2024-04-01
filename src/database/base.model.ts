import { Column, DataType, Default, Model, PrimaryKey } from "sequelize-typescript";

export class BaseModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column
    id: string;
}
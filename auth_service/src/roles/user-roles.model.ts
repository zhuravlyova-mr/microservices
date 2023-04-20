import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {Role} from "./roles.model";


@Table({tableName: 'user_roles', createdAt: false, updatedAt: false})
export class UserRoles extends Model<UserRoles> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey( () => Role)
    @ApiProperty({description: 'Внешний ключ из таблицы ролей'})
    @Column({type: DataType.INTEGER, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    roleId: number;

    @ForeignKey( () => User)
    @ApiProperty({description: 'Внешний ключ из таблицы пользователей'})
    @Column({type: DataType.INTEGER, onDelete: "CASCADE", onUpdate: "CASCADE"})
    userId: number;
}
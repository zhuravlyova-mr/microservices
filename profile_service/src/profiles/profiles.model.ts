import {BelongsTo, ForeignKey, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
//import {User} from "../users/users.model";
//import { ConstraintMetadata } from "class-validator/types/metadata/ConstraintMetadata";

interface ProfileCreationAttrs {
    name: string;
    birthday: string;
    gender: string;
    phone: string;
    userId: number;
}

@Table({tableName: 'profiles', createdAt: false, updatedAt: false})
export class Profile extends Model<Profile, ProfileCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Иванов Александр', description: 'ФИО пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: '12.03.2010', description: 'Дата рождения пользователя'})
    @Column({type: DataType.DATEONLY, allowNull: true})
    birthday: string;

    @ApiProperty({example: 'м', description: 'Пол'})
    @Column({type: DataType.CHAR, allowNull: true})
    gender: string;
    
    @ApiProperty({example: '+79501113333', description: 'Номер телефона пользователя'})
    @Column({type: DataType.STRING, allowNull: true})
    phone: string;
    
    @ApiProperty({example: '1', description: 'Идентификатор пользователя из таблицы пользователей'})
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    // @BelongsTo(() => User)
    // user: User;
}

import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsPhoneNumber, IsString, Length} from "class-validator";

export class CreateProfileDto {
    @ApiProperty({example: 'user@mail.ru', description: 'E-mail адрес'})
    @IsString({message: 'Значение должно быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    readonly email: string;
    
    @ApiProperty({example: 'qwerty123', description: 'Пароль'})
    @Length(8, 50, {message: 'Не менее 8 и не более 50 символов'})
    @IsString({message: 'Значение должно быть строкой'})
    readonly password: string;
    
    @ApiProperty({example: 'User', description: 'Роль пользователя'})
    @IsString({message: 'Значение должно быть строкой'})
    readonly role: string;

    @ApiProperty({example: 'Иванов Александр', description: 'ФИО пользователя'})
    @IsString({message: 'Должно быть строкой'})
    name: string;

    @ApiProperty({example: '12.03.2010', description: 'Дата рождения пользователя'})
    @IsString({message: 'Должно быть строкой'})
    birthday: string;

    @ApiProperty({example: 'м', description: 'Пол'})
    @Length(1, 1, {message: 'Состоит из 1 символа'})
    @IsString({message: 'Должно быть строкой'})
    gender: string;

    @ApiProperty({example: '+79205000000', description: 'Номер телефона'})
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({example: '1', description: 'Id пользователя, внешний ключ'})
    userId?: number;

    @ApiProperty({example: '@#$$4fgdsgertewgewgwew', description: 'jwt-токен'})
    token?: string;
}
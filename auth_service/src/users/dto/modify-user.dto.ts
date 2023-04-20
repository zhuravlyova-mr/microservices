import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class ModifyUserDto {
    @ApiProperty({example: 'user@mail.ru', description: 'E-mail адрес'})
    @IsString({message: 'Значение должно быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    email: string;
    
    @ApiProperty({example: 'qwerty123', description: 'Пароль'})
    @Length(8, 50, {message: 'Не менее 8 и не более 50 символов'})
    @IsString({message: 'Значение должно быть строкой'})
    password: string;
    
    @ApiProperty({example: '1', description: 'Id пользователя'})
    userId?: number;
}
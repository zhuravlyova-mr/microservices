import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString} from "class-validator";

export class DeleteProfileDto {
    @ApiProperty({example: 'user@mail.ru', description: 'E-mail адрес'})
    @IsEmail({}, {message: 'Некорректный email'})
    readonly email: string;
    
    @ApiProperty({example: '1', description: 'Id пользователя'})
    userId?: number;
}
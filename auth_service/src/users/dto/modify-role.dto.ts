import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class ModifyRoleDto {
    @ApiProperty({example: 'User', description: 'Роль пользователя'})
    @IsString({message: "Должно быть строкой"})
    readonly oldRoleValue: string;

    @ApiProperty({example: 'Admin', description: 'Роль пользователя'})
    @IsString({message: "Должно быть строкой"})
    readonly newRoleValue: string;

    @ApiProperty({example: '1', description: 'Id пользователя'})
    @IsNumber({}, {message: "Должно быть числом"})
    readonly userId: number;
}

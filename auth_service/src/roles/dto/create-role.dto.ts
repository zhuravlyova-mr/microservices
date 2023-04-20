import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRoleDto {
    @ApiProperty({example: 'Admin', description: 'Название роли'})
    @IsString({message: 'Значение должно быть строкой'})
    readonly value: string;

    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    @IsString({message: 'Значение должно быть строкой'})
    readonly description: string;
}

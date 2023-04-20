import { Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Role} from "./roles.model";
import { JwtIfAdmin } from 'src/auth/jwt-if-admin.guard';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @ApiOperation({summary: 'Создать роль'})
    @ApiResponse({status: 200, type: Role})
    //@UseGuards(JwtIfAdmin)                //для пустой базы эта строка должна быть закомментирована
    @Post()                              
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.createRole(dto);
    }

    @ApiOperation({summary: 'Получить все роли'})
    @ApiResponse({status: 200, type: [Role]})
    @UseGuards(JwtIfAdmin)
    @Get()
    getAll() {
        return this.rolesService.getAllRoles();
    }

    @ApiOperation({summary: `Получить роль по значению: 'Admin' или 'User'`})
    @ApiResponse({status: 200, type: Role})
    @UseGuards(JwtIfAdmin)
    @Get('/:value')
    getByValue(@Param('value') value: string) {
        return this.rolesService.getRoleByValue(value);
    }

    @ApiOperation({summary: `Получить все роли по описанию (по части описания): 'Пользователь' или 'ользоват'`})
    @ApiResponse({status: 200, type: [Role]})
    @UseGuards(JwtIfAdmin)
    @Get('/description/:description')
    getByDescription(@Param('description') description: string) {
        return this.rolesService.getRolesByDescription(description);
    }
    
    @ApiOperation({summary: `Удалить роль по значению`})
    @ApiResponse({status: 200})
    @UseGuards(JwtIfAdmin)
    @Delete('/:value')
    deleteByValue(@Param('value') value: string) {
        return this.rolesService.deleteRoleByValue(value);
    }
}

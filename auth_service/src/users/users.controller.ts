import {Body, Controller, Get, Inject, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {ValidationPipe} from "../pipes/validation.pipe";
import { ModifyRoleDto } from './dto/modify-role.dto';
import { JwtIfAdmin } from 'src/auth/jwt-if-admin.guard';


@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    
    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
  //  @UseGuards(JwtIfAdmin)
    @Get()
    getAll() {
        
        return this.usersService.getAllUsers();
    }

    @ApiOperation({summary: 'Присвоить роль'})
    @ApiResponse({status: 200, type: AddRoleDto})
    @UsePipes(ValidationPipe)
    @UseGuards(JwtIfAdmin)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto);
    }

    @ApiOperation({summary: 'Изменить роль'})
    @ApiResponse({status: 200, type: ModifyRoleDto})
    @UseGuards(JwtIfAdmin)
    @Put('/role')
    modifyRole(@Body() dto: ModifyRoleDto) {
        return this.usersService.modifyRole(dto);
    }

    @ApiOperation({summary: 'Забанить пользователя'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(JwtIfAdmin)
    @Post('/ban')
    ban(@Body() dto: BanUserDto) {
        return this.usersService.ban(dto);
    }

    
}

import {Body, Controller, Get, Post, Put, Delete, UseGuards, UsePipes, Param, Inject} from '@nestjs/common';
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ProfilesService} from "./profiles.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Profile} from "./profiles.model";
import {ValidationPipe} from "../pipes/validation.pipe";
import { DeleteProfileDto } from './dto/delete-profile.dto';
import { ModifyProfileDto } from './dto/modify-profile.dto';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { JwtCheckUserGuard } from './jwt-check-user.guard';

@ApiTags('Профили пользователей')
@Controller('profiles')
export class ProfilesController {
    
    constructor(private profilesService: ProfilesService,
                @Inject('PROFILE_SERVICE') private readonly client: ClientProxy) {}

    //регистрация профиля: идет обращение в микросервис пользователя
    //для регистрации там пользователя и получения его id и токена       
    @ApiOperation({summary: 'Создать профиль пользователя'})
    @ApiResponse({status: 200, type: Profile})
    @Post('/registration')
    create(@Body() profileDto: CreateProfileDto) {
        this.client.emit('registration', profileDto);
    }
    
    //когда от пользователя приходит то же dto, 
    //но с добавленным id пользователя и токеном,
    //происходит окончательная регистрация профиля
    @EventPattern('registratedUser')
    async createProfile(registratedUser: CreateProfileDto) {
        this.profilesService.createProfile(registratedUser);
    }

    //та же манипуляция происходит с редактированием профиля (2 нижеследующих метода)
    //вначале эмитим, потом реагируем на эмит
    @ApiOperation({summary: 'Редактирование профиля'})
    @ApiResponse({status: 200, type: Profile})
   // @UseGuards(JwtCheckUserGuard) //можно раскомментировать, тогда нужно задавать токен в заголовке
    @Put()
    modifyUserProfile(@Body() profileDto: ModifyProfileDto) {
        this.client.emit('modification', profileDto);
    }
  
    @EventPattern('modifyedUser')
    async modifyProfile(modifyedUser: ModifyProfileDto) {
        this.profilesService.modifyProfile(modifyedUser);
    }
    
    //также удаление - с обращением к другому микросервису
    @ApiOperation({summary: 'Удаление профиля по email'})
    //@UseGuards(JwtCheckUserGuard)
    @Delete()
    deleteByEmail(@Body() profileDto: DeleteProfileDto) {
        this.client.emit('deletion', profileDto);
    }   
    
    @EventPattern('deleteUser')
    async deleteProfile(id: number) {
        this.profilesService.deleteProfileByEmail(id);
        this.client.emit('deleteUserAfterProfile', id);
    }

    @ApiOperation({summary: 'Получение всех профилей пользователей'})
    @ApiResponse({status: 200, type: [Profile]})
   // @UseGuards(JwtCheckUserGuard)
    @Get()
    getAll() {
        this.client.emit('hello', 'Hello from Profile!');
        return this.profilesService.getAllProfiles();
    }

    @ApiOperation({summary: 'Получение профиля по номеру телефона'})
    @ApiResponse({status: 200, type: Profile})
    @Get('/:phone')
    getByPhone(@Param('phone') phone: string) {
        return this.profilesService.getProfileByPhone(phone);
    }
}

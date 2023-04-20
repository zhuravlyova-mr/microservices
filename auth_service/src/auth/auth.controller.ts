import { Controller, Post, Body, Inject } from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import { AuthUserDto } from './dto/auth-user.dto';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ModifyProfileDto } from './dto/modify-profile.dto';
import { DeleteProfileDto } from './dto/delete-profile.dto';

@ApiTags('Авторизация') 
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService,  
        @Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

    @Post('/login')
    login(@Body() userDto: AuthUserDto) {
        return this.authService.login(userDto);
    }

    @EventPattern('registration')
    async userRegistration(dto: CreateProfileDto) {
       let userData = await this.authService.registration(dto);
       this.client.emit("registratedUser", userData);
    }

    @EventPattern('modification')
    async userModification(dto: ModifyProfileDto) {
       let userData = await this.authService.modifying(dto);
       this.client.emit("modifyedUser", userData);
    }

    @EventPattern('deletion')
    async userDeletion(dto: DeleteProfileDto) {
       let userData = await this.authService.deletion(dto);
       this.client.emit("deleteUser", userData);
    }

    @EventPattern('deleteUserAfterProfile')
    async userDeletionAfterProfile(id: number) {
       this.authService.deleteUserAfterProfile(id);
    }
}

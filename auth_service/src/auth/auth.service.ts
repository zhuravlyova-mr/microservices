import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";
import { ModifyUserDto } from 'src/users/dto/modify-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ModifyProfileDto } from './dto/modify-profile.dto';
import { DeleteProfileDto } from './dto/delete-profile.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: AuthUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(dto: CreateProfileDto) {
        const userDto: CreateUserDto = new CreateUserDto(); //создаем userDto из profileDto
        [userDto.email, userDto.password, userDto.role] = [dto.email, dto.password, dto.role];
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        let user = await this.userService.createUser({...userDto, password: hashPassword})
        const userToken = await this.generateToken(user);
        dto.userId = user.id;
        dto.token = userToken.token;
        return dto;
    }
    


    async modifying(dto: ModifyProfileDto) {
        
        let user: any;
        if (dto.userId) {  //если задан id - модифицируем email и password (ищем по id)
            user = await this.userService.getUserById(dto.userId);
            if (!user) {
                throw new HttpException('Пользователь с таким id не существует', HttpStatus.NOT_FOUND);
            }                     
        }
        else {               //если не задан id - модифицируем только password (ищем по email)
            user = await this.userService.getUserByEmail(dto.email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не существует', HttpStatus.NOT_FOUND);
            }
        }
        const hashPassword = await bcrypt.hash(dto.password, 5); //снова хешируем пароль (вдруг изменился)
        const userDto: ModifyUserDto = new ModifyUserDto(); //создаем userDto из profileDto
        [userDto.email, userDto.password, userDto.userId] = [dto.email, dto.password, dto.userId];
        await this.userService.modifyUser({...userDto, password: hashPassword});
        
        const userToken = await this.generateToken(user);
        dto.userId = user.id;
        dto.token = userToken.token;
        return dto;
    }

    async deletion(dto: DeleteProfileDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        return user.id;
    }

    async deleteUserAfterProfile(id: number) {
        let result = await this.userService.deleteUser(id);
        if (!result) {
            throw new HttpException('Не удалось удалить пользователя', HttpStatus.NOT_FOUND);
        }
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: AuthUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) {
            throw new UnauthorizedException({message: 'Нет пользователя с указанным email'})
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
}

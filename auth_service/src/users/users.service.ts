import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import { ModifyUserDto } from './dto/modify-user.dto';
import { ModifyRoleDto } from './dto/modify-role.dto';

@Injectable()
export class UsersService {
    
    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService) {}

    async createUser(dto: CreateUserDto) {
        let user = await this.userRepository.create(dto);                //создать пользователя
        
        let userRole = await this.roleService.getRoleByValue(dto.role); //возьмем роль из запроса
        
        if (!userRole) {                                                //если в запросе нет роли
            userRole = await this.roleService.getRoleByValue('User');   //по умлч роль будет User
        }
        
        if (!userRole) {
            throw new HttpException('Роль отсутствует в БД', HttpStatus.NOT_FOUND);
        }              
        
        await user.$set('roles', [userRole.id]);
        user.roles = [userRole];
        return user;
    }

    async modifyUser(dto: ModifyUserDto) {
        let count: any;
        if (dto.userId) {  
            count = await this.userRepository.update(
                { email: dto.email, password: dto.password },
                { where: { id: dto.userId } }
            );                      
        }
        else {
            count = await this.userRepository.update(
                { password: dto.password },
                { where: { email: dto.email } }
            );
        }
        if (!count) {
            throw new HttpException('Не удалось модифицировать пользователя', HttpStatus.BAD_REQUEST);
        }
    }  
       
    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne({where: {id}, include: {all: true}});
        return user;
    }

    async deleteUser(id: number) {
        const count = await this.userRepository.destroy({where: {id}})
        if (!count) {
            throw new HttpException('Пользователь не был удален', HttpStatus.NOT_FOUND);
        }
        return id;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }
    
    //модификация роли - только админ
    //если новая роль уже есть, старая удаляется
    async modifyRole(dto: ModifyRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.oldRoleValue);
        const newrole = await this.roleService.getRoleByValue(dto.newRoleValue);
        if (user && role && newrole) {
            await user.$remove('role', role.id);
            await user.$add('role', newrole.id);
        }
        else {
            throw new HttpException('Пользователь или роли не найдены', HttpStatus.NOT_FOUND);
        }
        return dto;
    }

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }

}

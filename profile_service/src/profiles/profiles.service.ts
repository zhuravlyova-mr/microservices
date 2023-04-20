import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
//import { CreateUserDto } from './dto/create-user.dto';
import {CreateProfileDto} from "./dto/create-profile.dto";
import { Profile } from './profiles.model';
import { DeleteProfileDto } from './dto/delete-profile.dto';
//import { ModifyUserDto } from './dto/modify-user.dto';
import { ModifyProfileDto } from './dto/modify-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class ProfilesService {
    
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile) {}

    async createProfile(dto: CreateProfileDto) {
        const profile = await this.profileRepository.create({
            name: dto.name,
            birthday: dto.birthday,
            gender: dto.gender,
            phone: dto.phone,
            userId: dto.userId
        });
        if (!profile) {
            throw new HttpException('Профиль не создан', HttpStatus.BAD_REQUEST);
        }
        return profile;
    }
    
    //для модификации профиля идет обращение из профиля в модуль auth, оттуда - в user
    async modifyProfile(dto: ModifyProfileDto) {
        const profile = await this.profileRepository.findOne({where: { userId: dto.userId} });
        if (!profile) {
            throw new HttpException('Профиль не существует', HttpStatus.BAD_REQUEST);
        }
        for (let key in dto) {       //если не все данные изменяются, нужно в запрос поместить старые данные
            dto[key] = dto[key] || profile[key];   //если есть - берем из dto, иначе из profile
        }
            
        const count = await this.profileRepository.update(
            { birthday: dto.birthday, name: dto.name, gender: dto.gender, phone: dto.phone },
            { where: { userId: dto.userId } }
        );

        if (!count) {
            throw new HttpException('Что-то пошло не так c апдейтом профиля...', HttpStatus.BAD_REQUEST);
        }
        return dto.token; //вернем токен
    } 
    

    async getAllProfiles() {
        const profiles = await this.profileRepository.findAll({include: {all: true}});
        return profiles;
    }

    async getProfileByPhone(phone: string) {
        const profile = await this.profileRepository.findOne({where: {phone}, include: {all: true}});
        return profile;
    }
    
    
    async deleteProfileByEmail(id: number) {
        
        const result = await this.profileRepository.destroy({   //вначале удаляется профиль
                 where: {
                   userId: id,
                 },
        });
        if (!result) {
            throw new HttpException('Не удалось удалить профиль', HttpStatus.NOT_FOUND);
        }
    }
}

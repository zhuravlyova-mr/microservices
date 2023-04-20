//п.4 - Модуль для работы с профилем
import { forwardRef, Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "./profiles.model";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    SequelizeModule.forFeature([Profile]),
    ClientsModule.register([
      {
        name: 'PROFILE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  exports: [
    ProfilesService
  ]
})

export class ProfilesModule {}

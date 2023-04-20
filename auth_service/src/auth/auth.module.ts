import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      forwardRef( () => UsersModule),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'SECRET',
        signOptions: {
          expiresIn: '24h'
        }
      }),
      ClientsModule.register([
        {
          name: 'AUTH_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://user:password@localhost:5672'],
            queue: 'profile_queue',
            queueOptions: {
              durable: false
            },
          },
        },
      ]),
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}

import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import { ProfilesModule } from './profiles/profiles.module';
import { Profile } from "./profiles/profiles.model";

import * as path from "path";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    controllers: [],
    providers: [],
    imports: [
      ConfigModule.forRoot(
        {envFilePath: `.${process.env.NODE_ENV}.env`,}),
         SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          models: [Profile],
          autoLoadModels: true
        }),    
      ProfilesModule,
      ClientsModule.register([
        {
          name: 'PROFILE_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'profile_queue',
            queueOptions: {
              durable: false
            },
          },
        },
      ]),
    ]
})


export class AppModule {}
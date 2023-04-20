import { NestFactory } from '@nestjs/core';
import { AppModule } from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "./pipes/validation.pipe";
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function start() {
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'user_queue',
      queueOptions: {
        durable: false
      },
    }
  });

  await app.listen();
  
}

start();

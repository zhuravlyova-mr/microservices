import { NestFactory } from '@nestjs/core';
import { AppModule } from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "./pipes/validation.pipe";
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT, () => 
      console.log(`Server started on port ${PORT}`));
}

start();


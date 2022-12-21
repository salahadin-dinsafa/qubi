import { NestFactory } from '@nestjs/core';
import * as fs from 'fs'

import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

const logStream: fs.WriteStream = fs.createWriteStream('api.log', { flags: 'a' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionFilter);
  app.use(morgan('combined', { stream: logStream }));
  await app.listen(3000);
}
bootstrap();

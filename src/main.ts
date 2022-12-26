import { NestFactory } from '@nestjs/core';
import * as fs from 'fs'
import { Logger } from '@nestjs/common/services';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { config } from 'dotenv';
config();

import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

const logStream: fs.WriteStream = fs.createWriteStream('api.log', { flags: 'a' });
async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionFilter);

  logger.verbose('Generating api.log file');
  app.use(morgan('combined', { stream: logStream }));

  
  const options = new DocumentBuilder()
    .setTitle('Qubi Application')
    .setContact('Salahadin Dinsafa', '', 'salahadindinsafa@gmail.com')
    .setDescription('Ethiopian Traditional Banking System')
    .setVersion('1.0.0')
    .setExternalDoc('Hilton Website', 'http://www.tadias.com/v1n6/OP_2_2003-1.html')
    .setLicense('MIT', 'https://api.openapi.org/MIT')
    .build()
  const document = SwaggerModule.createDocument(app, options);
  
  logger.verbose('Generating Swagger Documentation');
  SwaggerModule.setup('api', app, document);
  logger.verbose(`Application started at port ${process.env.port}`);
  await app.listen(+process.env.port);
}
bootstrap();

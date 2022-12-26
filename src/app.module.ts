import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';

import { MembershipsModule } from './memberships/memberships.module';
import { TransfersModule } from './transfers/transfers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QubiModule } from './qubi/qubi.module';
import { OptionalJwtAuthGuard } from './common/guard/optional-jwt.guard';
import { ormConfig } from './common/db/ormconfig.datasource';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.required(),
        DB_PORT: Joi.required().default(5432),
        DB_USER: Joi.required(),
        DB_PASSWORD: Joi.required(),
        DB_NAME: Joi.required(),
        JWT_SECRET: Joi.required()
      })
    }),
    AuthModule,
    UsersModule,
    QubiModule,
    MembershipsModule,
    TransfersModule,
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true }
      })
    },
    {
      provide: APP_GUARD,
      useClass: OptionalJwtAuthGuard
    }
  ]
})
export class AppModule { }

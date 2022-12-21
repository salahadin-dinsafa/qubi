import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { QubiModule } from '../qubi/qubi.module';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    QubiModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity]),
   
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }

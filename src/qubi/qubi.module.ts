import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { QubiController } from './qubi.controller';
import { QubiService } from './qubi.service';
import { AuthModule } from '../auth/auth.module';
import { QubiEntity } from './entities/qubi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QubiEntity]),
    AuthModule,

  ],
  providers: [QubiService],
  controllers: [QubiController],
  exports: [QubiService]
})
export class QubiModule { }

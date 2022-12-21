import { Module, forwardRef } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { QubiService } from './qubi.service';
import { QubiController } from './qubi.controller';
import { AuthModule } from '../auth/auth.module';
import { QubiEntity } from './entities/qubi.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([QubiEntity])
  ],
  providers: [QubiService],
  controllers: [QubiController],
  exports: [QubiService]
})
export class QubiModule { }

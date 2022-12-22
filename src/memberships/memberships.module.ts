import { Module } from '@nestjs/common';

import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { AuthModule } from '../auth/auth.module';
import { QubiModule } from '../qubi/qubi.module';

@Module({
  imports: [
    AuthModule,
    QubiModule,
  ],
  providers: [MembershipsService],
  controllers: [MembershipsController]
})
export class MembershipsModule { }

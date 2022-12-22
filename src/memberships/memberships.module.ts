import { Module } from '@nestjs/common';

import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { AuthModule } from '../auth/auth.module';
import { QubiModule } from '../qubi/qubi.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    QubiModule,
    UsersModule
  ],
  providers: [MembershipsService],
  controllers: [MembershipsController]
})
export class MembershipsModule { }

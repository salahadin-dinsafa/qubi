import {
    Controller, Delete,
    Param, ParseIntPipe, Post, UseGuards
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../users/types/roles.type';
import { UserResponse } from '../users/types/user-response.type';
import { MembershipsService } from './memberships.service';

@Controller('memberships')
@UseGuards(AuthGuard(), RolesGuard)
export class MembershipsController {
    constructor(private readonly memebershipService: MembershipsService) { }

    @Role(Roles.ADMIN)
    @Post(':slug/:userId')
    addUserToQubi(
        @Param('slug') slug: string,
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<UserResponse> {
        return this.memebershipService.addUserToQubi(slug, userId)
    }

    @Role(Roles.ADMIN)
    @Delete(':slug/:userId')
    removeUserQubi(
        @Param('slug') slug: string,
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<UserResponse> {
        return this.memebershipService.removeUserQubi(slug, userId);
    }

}

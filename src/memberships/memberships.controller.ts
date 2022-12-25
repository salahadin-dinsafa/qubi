import {
    Controller, Delete,
    Param, ParseIntPipe,
    Post, UseGuards,
    Logger
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';

import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../users/types/roles.type';
import { UserResponse } from '../users/types/user-response.type';
import { MembershipsService } from './memberships.service';

@ApiTags('Memebership')
@Controller('memberships')
@UseGuards(AuthGuard(), RolesGuard)
export class MembershipsController {
    logger = new Logger('MemebershipController');
    constructor(private readonly memebershipService: MembershipsService) { }

    @ApiOperation({ summary: 'user memebership', description: 'Adding user to qubi' })
    @Role(Roles.ADMIN)
    @Post(':slug/:userId')
    addUserToQubi(
        @Param('slug') slug: string,
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<UserResponse> {
        this.logger.verbose(`Adding User with #id: ${userId} To qubi #slug: ${slug}`)
        return this.memebershipService.addUserToQubi(slug, userId)
    }

    @ApiOperation({ summary: 'user memebership', description: 'Removing user from qubi' })
    @Role(Roles.ADMIN)
    @Delete(':slug/:userId')
    removeUserQubi(
        @Param('slug') slug: string,
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<UserResponse> {
        this.logger.verbose(`Removing User with #id: ${userId} From qubi slug with #slug: ${slug}`)
        return this.memebershipService.removeUserQubi(slug, userId);
    }

}

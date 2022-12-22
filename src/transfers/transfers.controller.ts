import {
    Controller, Delete, Param,
    ParseIntPipe, Post, Query, UseGuards
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { UserResponse } from '../users/types/user-response.type';
import { Roles } from '../users/types/roles.type';
import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TransfersService } from './transfers.service';
import { TransferDto } from './dto/tranfer.dto';

@Controller('transfers')
@UseGuards(AuthGuard(), RolesGuard)
export class TransfersController {
    constructor(private readonly transferService: TransfersService) { }

    @Role(Roles.ADMIN)
    @Post(':userId')
    depositeMany(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() transferDto: TransferDto
    ): Promise<UserResponse> {
        return this.transferService.depositeMany(userId, transferDto);
    }

    @Role(Roles.ADMIN)
    @Delete(':userId')
    withdrawMany(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() transferDto: TransferDto
    ): Promise<UserResponse> {
        return this.transferService.withdrawMany(userId, transferDto);
    }
}

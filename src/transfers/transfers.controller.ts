import {
    Controller, Delete, Param,
    ParseIntPipe, Post,
    Query, UseGuards, Logger
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger/dist';

import { UserResponse } from '../users/types/user-response.type';
import { Roles } from '../users/types/roles.type';
import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TransfersService } from './transfers.service';
import { TransferDto } from './dto/tranfer.dto';

@ApiTags('Transfers')
@Controller('transfers')
@UseGuards(AuthGuard(), RolesGuard)
export class TransfersController {
    logger = new Logger('TransfersController')
    constructor(private readonly transferService: TransfersService) { }

    @ApiOperation({ summary: 'Deposite maney', description: 'User depositing maney' })
    @Role(Roles.ADMIN)
    @Post(':userId')
    depositeManey(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() transferDto: TransferDto
    ): Promise<UserResponse> {
        this.logger.verbose(`User with #id: ${userId} depositing maney with transferDto: ${transferDto}`)
        return this.transferService.depositeManey(userId, transferDto);
    }

    @ApiOperation({ summary: 'Withdraw maney', description: 'User withdraw maney' })
    @Role(Roles.ADMIN)
    @Delete(':userId')
    withdrawManey(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() transferDto: TransferDto
    ): Promise<UserResponse> {
        this.logger.verbose(`User with #id: ${userId} Withdrawing maney with transferDto: ${transferDto}`)
        return this.transferService.withdrawManey(userId, transferDto);
    }
}

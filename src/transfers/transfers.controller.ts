import {
    Controller, Delete, Param,
    ParseIntPipe, Post,
    Query, UseGuards, Logger
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger/dist';

import { UserResponse, UserResponseObject } from '../users/types/user-response.type';
import { Roles } from '../users/types/roles.type';
import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TransfersService } from './transfers.service';
import { TransferDto } from './dto/tranfer.dto';
import { ApiOkResponse, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { CustomeHttpExceptionResponseObject } from 'src/common/types/http-exception-response.interface';

@ApiUnprocessableEntityResponse({ type: CustomeHttpExceptionResponseObject })
@ApiUnauthorizedResponse({ type: CustomeHttpExceptionResponseObject })
@ApiTags('Transfers')
@Controller('transfers')
@UseGuards(AuthGuard(), RolesGuard)
export class TransfersController {
    logger = new Logger('TransfersController')
    constructor(private readonly transferService: TransfersService) { }

    @ApiOperation({ summary: 'Deposite maney', description: 'User depositing maney' })
    @ApiCreatedResponse({ type: UserResponseObject, description: 'User added to qubi' })
    @Role(Roles.ADMIN)
    @Post(':userId')
    depositeManey(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() transferDto: TransferDto
    ): Promise<UserResponse> {
        this.logger.verbose(`User with #id: ${userId} depositing maney with transferDto: ${JSON.stringify(transferDto)}`)
        return this.transferService.depositeManey(userId, transferDto);
    }

    @ApiOperation({ summary: 'Withdraw maney', description: 'User withdraw maney' })
    @ApiOkResponse({ type: UserResponseObject, description: 'User Removed from qubi' })
    @Role(Roles.ADMIN)
    @Delete(':userId')
    withdrawManey(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() transferDto: TransferDto
    ): Promise<UserResponse> {
        this.logger.verbose(`User with #id: ${userId} Withdrawing maney with transferDto: ${JSON.stringify(transferDto)}`)
        return this.transferService.withdrawManey(userId, transferDto);
    }
}

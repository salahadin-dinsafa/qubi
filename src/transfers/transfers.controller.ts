import { Controller, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/decorators/role.decorator';
import { Roles } from 'src/users/types/roles.type';

import { RolesGuard } from '../auth/guards/roles.guard';
import { TransfersService } from './transfers.service';

@Controller('transfers')
@UseGuards(AuthGuard(), RolesGuard)
export class TransfersController {
    constructor(private readonly transferService: TransfersService) { }

    @Role(Roles.ADMIN)
    @Post()
    depositeMany() { }
}

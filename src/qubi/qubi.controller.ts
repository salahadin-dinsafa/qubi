import { Controller, Post, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';

import { AuthGuard } from '@nestjs/passport';

import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../users/types/roles.type';
import { CreateQubiDto } from './dto/create-qubi.dto';
import { QubiService } from './qubi.service';
import { Qubi } from './types/qubi.type';

@Controller('qubi')
@UseGuards(AuthGuard(), RolesGuard)
export class QubiController {
    constructor(private readonly qubiService: QubiService) { }

    @Role(Roles.ADMIN)
    @Post()
    addQubi(@Body() createQubiDto: CreateQubiDto): Promise<Qubi> {
        return this.qubiService.addQubi(createQubiDto)
    }
}

import {
    Controller, Get, Param,
    Post, UseGuards, Query, Body, Delete
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { Roles } from '../users/types/roles.type';
import { QubiPaginationDto } from './dto/qubi-pagination.dto';
import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { QubiResponse } from './types/qubi-response.type';
import { Qubi } from './types/qubi.type';
import { CreateQubiDto } from './dto/create-qubi.dto';
import { QubiService } from './qubi.service';

@Controller('qubi')
export class QubiController {
    constructor(private readonly qubiService: QubiService) { }

    @UseGuards(AuthGuard(), RolesGuard)
    @Role(Roles.ADMIN)
    @Post()
    addQubi(@Body() createQubiDto: CreateQubiDto): Promise<Qubi> {
        return this.qubiService.addQubi(createQubiDto)
    }

    @Get(':slug')
    getQubi(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string): Promise<QubiResponse> {
        return this.qubiService.getQubi(user, slug);
    }

    @Get()
    getAllQubi(
        @GetUser() user: UserEntity,
        @Query() paginationDto: QubiPaginationDto
    ): Promise<QubiResponse[]> {
        return this.qubiService.getAllQubi(user, paginationDto);
    }

    @UseGuards(AuthGuard(), RolesGuard)
    @Role(Roles.ADMIN)
    @Delete(':slug')
    deleteQubi(@Param('slug') slug: string): Promise<void> {
        return this.qubiService.deleteQubi(slug);
    }
}

import {
    Controller, Get, Param,
    Post, UseGuards, Query,
    Body, Delete, Logger
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Qubi')
@Controller('qubi')
export class QubiController {
    logger = new Logger('QubiContrller');
    constructor(private readonly qubiService: QubiService) { }

    @ApiOperation({ summary: 'Add Qubi', description: 'Admin adding qubi' })
    @UseGuards(AuthGuard(), RolesGuard)
    @Role(Roles.ADMIN)
    @Post()
    addQubi(@Body() createQubiDto: CreateQubiDto): Promise<Qubi> {
        this.logger.verbose(`Adding Qubi with #createQubiDto: ${createQubiDto}`)
        return this.qubiService.addQubi(createQubiDto)
    }

    @ApiOperation({ summary: 'Get Qubi', description: 'Getting a single qubi' })
    @Get(':slug')
    getQubi(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string): Promise<QubiResponse> {
        this.logger.verbose(`Getting Qubi with #slug: ${slug}`);
        return this.qubiService.getQubi(user, slug);
    }

    @ApiOperation({ summary: 'Getting Qubi', description: 'Getting All Qubi' })
    @Get()
    getAllQubi(
        @GetUser() user: UserEntity,
        @Query() paginationDto: QubiPaginationDto
    ): Promise<QubiResponse[]> {
        this.logger.verbose(`Getting All Qubi with #paginationDto: ${paginationDto}`)
        return this.qubiService.getAllQubi(user, paginationDto);
    }

    @ApiOperation({ summary: 'Deleting Qubi', description: 'Deleting a single qubi' })
    @UseGuards(AuthGuard(), RolesGuard)
    @Role(Roles.ADMIN)
    @Delete(':slug')
    deleteQubi(@Param('slug') slug: string): Promise<void> {
        this.logger.verbose(`Delte Qubi with #slug: ${slug}`)
        return this.qubiService.deleteQubi(slug);
    }
}

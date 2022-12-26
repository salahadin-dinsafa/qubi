import {
    Body, Controller, Delete,
    Get, Param, Patch, Post,
    UseGuards, ParseIntPipe,
    Logger
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger/dist';

import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthService } from '../auth/auth.service';
import { SignupDto } from '../auth/dto/signup.dto';
import { UsersService } from './users.service';
import { UserResponse, UserResponseObject } from './types/user-response.type';
import { Roles } from './types/roles.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { CustomeHttpExceptionResponseObject } from 'src/common/types/http-exception-response.interface';

@ApiUnprocessableEntityResponse({ type: CustomeHttpExceptionResponseObject })
@ApiUnauthorizedResponse({ type: CustomeHttpExceptionResponseObject })
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
    logger = new Logger(`UsersController`)
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService,

    ) { }
    @ApiOperation({ summary: 'Getting users', description: 'Getting all users' })
    @ApiOkResponse({ type: UserResponseObject, isArray: true })
    @Role(Roles.ADMIN)
    @Get()
    getUsers(@Body() paginationDto: PaginationDto): Promise<UserResponse[]> {
        this.logger.verbose(`Getting All user with #paginationDto: ${JSON.stringify(paginationDto)}`)
        return this.userService.getUsers(paginationDto);
    }

    @ApiOperation({ summary: 'get user', description: 'Get current user' })
    @ApiOkResponse({ type: UserResponseObject })
    @Get('current')
    getCurrentUser(@GetUser() user: UserEntity): UserResponse {
        this.logger.verbose(`Getting current user`)
        return this.authService.getBuildUserResponse(user);
    }

    @ApiOperation({ summary: 'get user', description: 'get a single user' })
    @ApiOkResponse({ type: UserResponseObject })
    @ApiNotFoundResponse({ type: CustomeHttpExceptionResponseObject })
    @Role(Roles.ADMIN)
    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
        this.logger.verbose(`Getting user with #id ${id}`);
        return this.userService.getUser(id);
    }

    @ApiOperation({ summary: 'Add user', description: 'Adding user' })
    @ApiCreatedResponse({ type: UserResponseObject })
    @Role(Roles.ADMIN)
    @Post()
    addUser(
        @Body() addUserDto: SignupDto): Promise<UserResponse> {
        this.logger.verbose(`Adding user with #addUserDto: ${JSON.stringify(addUserDto)}`);
        return this.userService.addUser(addUserDto);
    }

    @ApiOperation({ summary: 'Update user', description: 'Updating user' })
    @ApiOkResponse({ type: UserResponseObject })
    @ApiNotFoundResponse({ type: CustomeHttpExceptionResponseObject })
    @Role(Roles.ADMIN)
    @Patch(':id')
    updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Param('id', ParseIntPipe) id: number)
        : Promise<UserResponse> {
        this.logger.verbose(`Updating user with #updateUserDto: ${JSON.stringify(updateUserDto)}`);
        return this.userService.updateUser(id, updateUserDto)
    }

    @ApiOperation({ summary: 'Removing user', description: 'Removing a single user' })
    @ApiNotFoundResponse({ type: CustomeHttpExceptionResponseObject })
    @Role(Roles.ADMIN)
    @Delete(':id')
    removeUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        this.logger.verbose(`Removing user with #id: ${id}`);
        return this.userService.removeUser(id);
    }

}

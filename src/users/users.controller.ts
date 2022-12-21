import {
    Body, Controller, Delete,
    Get, Param, Patch, Post,
    UseGuards, ParseIntPipe
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { Role } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SignupDto } from '../auth/dto/signup.dto';
import { UsersService } from './users.service';
import { UserResponse } from './types/user-response.type';
import { Roles } from './types/roles.type';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Role(Roles.ADMIN)
    @Get()
    getUsers(): Promise<UserResponse[]> {
        return this.userService.getUsers();
    }

    @Role(Roles.ADMIN)
    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
        return this.userService.getUser(id);
    }

    @Role(Roles.ADMIN)
    @Post()
    addUser(
        @Body() addUserDto: SignupDto): Promise<UserResponse> {
        return this.userService.addUser(addUserDto);
    }

    @Role(Roles.ADMIN)
    @Patch(':id')
    updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Param('id', ParseIntPipe) id: number)
        : Promise<UserResponse> {
        return this.userService.updateUser(id, updateUserDto)
    }

    @Role(Roles.ADMIN)
    @Delete(':id')
    removeUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.removeUser(id);
    }

}
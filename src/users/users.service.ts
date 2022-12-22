import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';

import { QubiService } from '../qubi/qubi.service';
import { QubiEntity } from '../qubi/entities/qubi.entity';
import { QubiResponse } from '../qubi/types/qubi-response.type';
import { UserEntity } from './entities/user.entity';
import { UserResponse } from './types/user-response.type';
import { SignupType } from '../auth/types/signup.type';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UpdateUserType } from './types/update-user.type';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService
    ) { }



    async getUserById(id: number): Promise<UserEntity> {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { id } });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!user)
            throw new NotFoundException(`User with #id: ${id} not found`);
        return user;
    }

    async addUser(addUser: SignupType): Promise<UserResponse> {
        let user: UserEntity = await this.authService.findByEmail(addUser.email);
        if (user)
            throw new UnprocessableEntityException(`User with #email: ${addUser.email} already exsist`)
        try {
            user = this.userRepository.create({
                ...addUser,
                password: await hash(addUser.password, 15)
            })
            return this.authService.getBuildUserResponse(await user.save());
        } catch (error) {
            if (error.code === '23505')
                throw new UnprocessableEntityException(`User with #email: ${addUser.email} already exsist`)
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async getUser(id: number): Promise<UserResponse> {
        return await this.getUserById(id)
            .then(user => this.authService.getBuildUserResponse(user));
    }

    async getUsers(): Promise<UserResponse[]> {
        try {
            return (await this.userRepository.find())
                .map(user => this.authService.getBuildUserResponse(user));
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async updateUser(id: number, updateUser: UpdateUserType): Promise<UserResponse> {
        let user: UserEntity = await this.getUserById(id);
        try {
            updateUser.password ?
                Object.assign(user, { ...updateUser, password: await hash(updateUser.password, 15) }) :
                Object.assign(user, { ...updateUser });

            return await this.userRepository.save(user)
                .then(user => this.authService.getBuildUserResponse(user));
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)

        }
    }

    async removeUser(id: number): Promise<void> {
        let user: UserEntity = await this.getUserById(id);
        try {
            await this.userRepository.remove(user);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
}

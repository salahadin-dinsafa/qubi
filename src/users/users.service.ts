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

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly qubiService: QubiService,
    ) { }

    async findByEmail(email: string): Promise<UserEntity> {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { email } });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        return user;
    }

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
        let user: UserEntity = await this.findByEmail(addUser.email);
        if (user)
            throw new UnprocessableEntityException(`User with #email: ${addUser.email} already exsist`)
        try {
            user = this.userRepository.create({
                ...addUser,
                password: await hash(addUser.password, 15)
            })
            return this.getBuildUserResponse(await user.save());
        } catch (error) {
            if (error.code === '23505')
                throw new UnprocessableEntityException(`User with #email: ${addUser.email} already exsist`)
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async getUser(id: number): Promise<UserResponse> {
        return await this.getUserById(id)
            .then(user => this.getBuildUserResponse(user));
    }

    async getUsers(): Promise<UserResponse[]> {
        try {
            return (await this.userRepository.find())
                .map(user => this.getBuildUserResponse(user));
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
                .then(user => this.getBuildUserResponse(user));
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

    getBuildUserResponse(user: UserEntity): UserResponse {
        let usersQubi: QubiEntity;
        let qubi: QubiResponse;

        user.qubi ? usersQubi = user.qubi : usersQubi = null;

        if (usersQubi) {
            qubi =
                this.qubiService.getBuildQubiResponse(user, usersQubi);
        }
        delete user.max_day;
        delete user.max_many;
        delete user.password;
        return {
            ...user,
            qubi
        }
    }
}

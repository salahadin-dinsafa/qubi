import {
    Injectable,
    UnprocessableEntityException, NotFoundException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { hash } from 'bcryptjs';


import { QubiEntity } from '../qubi/entities/qubi.entity';
import { SignupType } from '../auth/types/signup.type';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from './entities/user.entity';
import { UserResponse } from './types/user-response.type';
import { UpdateUserType } from './types/update-user.type';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService,
        private readonly datasource: DataSource
    ) { }

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
        return await this.authService.getUserById(id)
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
        let user: UserEntity = await this.authService.getUserById(id);
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

    /**
     * While deleting user we should have to cheack if the have qubi
     *  
     */
    // todo: cheack if user has not debt
    async removeUser(id: number): Promise<void> {
        let user: UserEntity = await this.authService.getUserById(id);
        if (!user.qubi) {
            await this.userRepository.remove(user);
        } else {
            let qubi: QubiEntity = user.qubi;
            const queryRunner = this.datasource.createQueryRunner();
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction();

                qubi.userCount -= 1;

                await queryRunner.manager.save(qubi);
                await queryRunner.manager.remove(user);
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw new UnprocessableEntityException(`${error.message}`)
            } finally {
                await queryRunner.release();
            }
        }
    }
}

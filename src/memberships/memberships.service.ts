import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { QubiEntity } from '../qubi/entities/qubi.entity';
import { QubiService } from '../qubi/qubi.service';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserResponse } from '../users/types/user-response.type';
import { DataSource } from 'typeorm';

@Injectable()
export class MembershipsService {
    constructor(
        private readonly authService: AuthService,
        private readonly qubiService: QubiService,
        private readonly userService: UsersService,
        private readonly datasource: DataSource

    ) { }

    async addUserToQubi(slug: string, userId: number): Promise<UserResponse> {
        let user: UserEntity = await this.userService.getUserById(userId);
        if (user.qubi)
            throw new UnprocessableEntityException(`User with #email: ${user.email} already have qubi`)
        let qubi: QubiEntity = await this.qubiService.getQubiBySlug(slug);
        const queryRunner = this.datasource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            user.max_many = (30 * qubi.amount * qubi.duration);
            user.max_day = (30 * qubi.duration)
            user.left_many = user.max_many;
            user.left_day = user.max_day;
            user.qubi = qubi;
            qubi.userCount += 1;
            await queryRunner.manager.save(user);
            await queryRunner.manager.save(qubi);
            await queryRunner.commitTransaction();
            return this.authService.getBuildUserResponse(user);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new UnprocessableEntityException(`${error.message}`)
        } finally {
            await queryRunner.release();
        }
    }

    async removeUserQubi(slug: string, userId: number): Promise<UserResponse> {
        let user: UserEntity = await this.userService.getUserById(userId);
        if (!user.qubi)
            throw new UnprocessableEntityException(`User with #email: ${user.email} don't have qubi`);
        let qubi: QubiEntity = await this.qubiService.getQubiBySlug(slug);
        if (user.qubi.slug !== qubi.slug)
            throw new UnprocessableEntityException(`User's don't have this qubi`);
        const queryRunner = this.datasource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            user.qubi = null;
            qubi.userCount -= 1;

            await queryRunner.manager.save(user);
            await queryRunner.manager.save(qubi);
            await queryRunner.commitTransaction();
            return this.authService.getBuildUserResponse(user);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new UnprocessableEntityException(`${error.message}`)
        } finally {
            await queryRunner.release();
        }
    }
}

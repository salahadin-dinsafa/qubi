import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { QubiEntity } from '../qubi/entities/qubi.entity';
import { QubiService } from '../qubi/qubi.service';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserResponse } from '../users/types/user-response.type';

@Injectable()
export class MembershipsService {
    constructor(
        private readonly authService: AuthService,
        private readonly qubiService: QubiService,
        private readonly datasource: DataSource

    ) { }

    async addUserToQubi(slug: string, userId: number): Promise<UserResponse> {
        let user: UserEntity = await this.authService.getUserById(userId);
        if (user.qubi)
            throw new UnprocessableEntityException(`User with #email: ${user.email} already have qubi`)
        let qubi: QubiEntity = await this.qubiService.getQubiBySlug(slug);
        const queryRunner = this.datasource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            user.max_maney = (30 * qubi.amount * qubi.duration + qubi.amount);
            user.max_day = (30 * qubi.duration + 1)
            user.left_maney = user.max_maney;
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
        let user: UserEntity = await this.authService.getUserById(userId);
        if (!user.qubi)
            throw new UnprocessableEntityException(`User with #email: ${user.email} don't have qubi`);
        let qubi: QubiEntity = await this.qubiService.getQubiBySlug(slug);
        if (user.qubi.slug !== qubi.slug)
            throw new UnprocessableEntityException(`User's don't have this qubi`);
        if (user.deposited_maney > user.withdraw)
            throw new UnprocessableEntityException(`User with #id: ${user.id} must take his many`)
        if (user.deposited_maney < user.withdraw)
            throw new UnprocessableEntityException(`User with #id: ${user.id} must pay his debt`);

        const queryRunner = this.datasource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            user.qubi = null;
            user.max_day = 0;
            user.max_maney = 0;
            user.deposited_day = 0;
            user.deposited_maney = 0;
            user.left_maney = 0;
            user.left_day = 0;
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

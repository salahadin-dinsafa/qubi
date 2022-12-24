import {
    Injectable,
    UnprocessableEntityException,
    NotFoundException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import slugify from 'slugify';

import { QubiEntity } from './entities/qubi.entity';
import { CreateQubiType } from './types/create-qubi.type';
import { Qubi } from './types/qubi.type';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { QubiResponse } from './types/qubi-response.type';
import { PaginationType } from './types/pagination.type';

@Injectable()
export class QubiService {
    constructor(
        @InjectRepository(QubiEntity)
        private readonly qubiRepository: Repository<QubiEntity>,
        private readonly authService: AuthService,
        private readonly datasource: DataSource
    ) { }

    /** Main Helper */

    async getQubiByAmountAndDuration(amount: number, duration: number): Promise<QubiEntity> {
        let qubi: QubiEntity;
        if (!amount) amount = 5;
        if (!duration) duration = 1;
        try {
            qubi = await this.qubiRepository.findOne({ where: { amount, duration } })
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (qubi)
            throw new UnprocessableEntityException(
                `Qubi with #Duration: ${duration} and #Amount: ${amount} already exist`)
        return qubi;
    }

    async getQubiBySlug(slug: string): Promise<QubiEntity> {
        let qubi: QubiEntity;
        try {
            qubi = await this.qubiRepository.findOne({ where: { slug } });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!qubi) throw new NotFoundException(`Qubi with #slug: ${slug} not found`);
        return qubi;
    }


    /** Main Functionality */
    async addQubi(createQubi: CreateQubiType): Promise<Qubi> {
        let { amount, duration } = createQubi;
        if (amount)
            if (amount % 5 !== 0)
                throw new UnprocessableEntityException(`Amount of qubi mustbe divisible by 5`);
        let qubi: QubiEntity =
            await this.getQubiByAmountAndDuration(amount, duration);
        try {
            qubi = this.qubiRepository.create({
                ...createQubi,
                slug: this.buildSlug()
            })
            return this.getBuildQubi(await qubi.save());
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }

    }

    async getQubi(currentUser: UserEntity, slug: string): Promise<QubiResponse> {
        console.log(new Date());
        
        let qubi: QubiEntity = await this.getQubiBySlug(slug);
        try {
            return this.authService.getBuildQubiResponse(currentUser, qubi);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async getAllQubi(currentUser: UserEntity, pagination: PaginationType): Promise<QubiResponse[]> {
        const { limit, offset, maxUser, minUser } = pagination;
        try {
            let queryBuilder =
                this.datasource
                    .getRepository(QubiEntity)
                    .createQueryBuilder('qubis')
                    .leftJoinAndSelect('qubis.memebers', 'users');
            maxUser ?
                queryBuilder.andWhere('qubis.userCount <= :maxUser', { maxUser }) :
                null;
            minUser ?
                queryBuilder.andWhere('qubis.userCount >= :minUser', { minUser }) :
                null;
            limit ? queryBuilder.take(limit) : queryBuilder.take(10);
            offset ? queryBuilder.skip(offset) : queryBuilder.skip(0);

            return (await queryBuilder.getMany())
                .map(qubi => this.authService.getBuildQubiResponse(currentUser, qubi));
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async deleteQubi(slug: string): Promise<void> {
        // todo: now=2022-12-24 final=2022-12-25
        let qubi: QubiEntity = await this.getQubiBySlug(slug);
        const f: Date = qubi.endDate;
        const n: Date = new Date();

        if (f.getFullYear() > n.getFullYear())
            throw new UnprocessableEntityException(`Qubi not expired yet`)

        if (f.getFullYear() === n.getFullYear()) {
            if (f.getMonth() > n.getMonth())
                throw new UnprocessableEntityException(`Qubi not expired yet`)
            if (f.getMonth() === n.getMonth()) {
                if (f.getDate() > n.getDate() || f.getDate() === n.getDate())
                    throw new UnprocessableEntityException('Qubi not expired yet')
            }
        }

        try {
            await this.qubiRepository.remove(qubi);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    /** Helper function */

    getBuildQubi(qubi: QubiEntity): Qubi {
        const final: Date = qubi.endDate;
        const now: Date = new Date();

        let month: number, day: number = 0;

        final.getFullYear() === now.getFullYear() ?
            month = final.getMonth() - now.getMonth() :
            month = final.getMonth() - now.getMonth() + 12;
        day = final.getDate() - now.getDate();

        day < 0 ? day = 0 : day = day;
        return {
            id: qubi.id,
            slug: qubi.slug,
            amount: qubi.amount,
            duration: qubi.duration,
            left_day: `${month}Month : ${day}Day`,
            userCount: qubi.userCount
        }
    }

    buildSlug(): string {
        return slugify((Math.random() * Math.pow(36, 6) | 0).toString(36), { lower: true })
    }
}

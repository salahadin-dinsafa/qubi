import {
    Injectable,
    UnprocessableEntityException,
    NotFoundException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { QubiEntity } from './entities/qubi.entity';
import { CreateQubiType } from './types/create-qubi.type';
import { Qubi } from './types/qubi.type';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { QubiResponse } from './types/qubi-response.type';

@Injectable()
export class QubiService {
    constructor(
        @InjectRepository(QubiEntity)
        private readonly qubiRepository: Repository<QubiEntity>,
        private readonly authService: AuthService
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
        let qubi: QubiEntity = await this.getQubiBySlug(slug);
        try {
            return this.authService.getBuildQubiResponse(currentUser, qubi);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async getAllQubi(currentUser: UserEntity): Promise<QubiResponse[]> {
        try {
            return (await this.qubiRepository.find())
                .map(qubi => this.authService.getBuildQubiResponse(currentUser, qubi))
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async deleteQubi(slug: string): Promise<void> {
        // todo: check if duration is completed
        let qubi: QubiEntity = await this.getQubiBySlug(slug);
        try {
            await this.qubiRepository.remove(qubi);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }


    /** Helper function */



    getBuildQubi(qubi: QubiEntity): Qubi {
        return {
            id: qubi.id,
            slug: qubi.slug,
            amount: qubi.amount,
            duration: qubi.duration,
            // todo: calculate left_day
            left_day: 2222222222222,
            userCount: qubi.userCount
        }
    }

    buildSlug(): string {
        return slugify((Math.random() * Math.pow(36, 6) | 0).toString(36), { lower: true })
    }
}

import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { QubiEntity } from './entities/qubi.entity';
import { CreateQubiType } from './types/create-qubi.type';
import { QubiResponse } from './types/qubi-response.type';
import { Qubi } from './types/qubi.type';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class QubiService {
    constructor(
        @InjectRepository(QubiEntity)
        private readonly qubiRepository: Repository<QubiEntity>
    ) { }

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
            throw new UnprocessableEntityException(`Qubi with #Duration: ${duration} and #Amount: ${amount} already exist`)
        return qubi;
    }

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


    /** Helper function */

    getBuildQubiResponse(currentUser: UserEntity, qubi: QubiEntity): QubiResponse {
        return {
            slug: currentUser.qubi.slug,
            amount: currentUser.qubi.amount,
            duration: currentUser.qubi.duration,
            // todo: calculate left_day
            left_day: 2222222222222,
            membership: currentUser.qubi.id === qubi.id,
            userCount: currentUser.qubi.userCount
        }
    }

    getBuildQubi(qubi: QubiEntity): Qubi {
        return {
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

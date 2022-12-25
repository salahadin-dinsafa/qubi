import { Injectable, UnprocessableEntityException } from '@nestjs/common';


import { UserEntity } from '../users/entities/user.entity';
import { UserResponse } from '../users/types/user-response.type';
import { AuthService } from '../auth/auth.service';
import { TransferType } from './types/transfer.type';

@Injectable()
export class TransfersService {
    constructor(
        private readonly authService: AuthService
    ) { }


    async depositeManey(userId: number, transfer: TransferType): Promise<UserResponse> {
        let user: UserEntity = await this.authService.getUserById(userId);
        if (!user.qubi)
            throw new UnprocessableEntityException(`User with #id: ${userId} don't have qubi`);
        const { amount } = transfer;
        if (amount > user.max_maney)
            throw new UnprocessableEntityException(`Amount must not excced ${user.max_maney}`);
        if (amount > user.left_maney)
            throw new UnprocessableEntityException(`User left only ${user.left_maney}`)
        if (amount % user.qubi.amount !== 0)
            throw new UnprocessableEntityException(`Amount must must feet: ${user.qubi.amount}`);

        try {
            // Cheack deposited_maney not excced max_maney
            if (user.deposited_maney >= user.max_maney)
                throw new UnprocessableEntityException(`User reached hi's max`)
            else
                user.deposited_maney += amount;
            // Cheack left_maney not less than 0
            if (user.left_maney <= 0)
                throw new UnprocessableEntityException(`User reached hi's max`)
            else
                user.left_maney -= amount;
            // Cheack deposited_day not excced max_day
            if (user.deposited_day >= user.max_day)
                throw new UnprocessableEntityException(`User reached hi's max`)
            else
                user.deposited_day += amount / user.qubi.amount;
            // Cheack left_day not less than 0
            if (user.left_day <= 0)
                throw new UnprocessableEntityException(`User reached hi's max`)
            else
                user.left_day -= amount / user.qubi.amount;

            return this.authService.getBuildUserResponse(await user.save());

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async withdrawManey(userId: number, transfer: TransferType): Promise<UserResponse> {
        // cheak user existance
        let user: UserEntity = await this.authService.getUserById(userId);
        // cheak qubi existance
        if (!user.qubi)
            throw new UnprocessableEntityException(`User with #id: ${userId} don't have qubi`);
        const { amount } = transfer;
        // cheak amount not excced max_maney
        if (amount > user.max_maney)
            throw new UnprocessableEntityException(`Amount must not excced ${user.max_maney}`);
        // cheak withdraw not excced limit
        if (amount > (user.max_maney - user.withdraw))
            throw new UnprocessableEntityException(`Can't withdraw this much`);
        if (amount % user.qubi.amount !== 0)
            throw new UnprocessableEntityException(`Amount must must feet: ${user.qubi.amount}`);

        try {
            user.withdraw += amount;

            return this.authService.getBuildUserResponse(await user.save());

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
}

import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import { UserResponse } from '../users/types/user-response.type';
import { UserEntity } from '../users/entities/user.entity';
import { Roles } from '../users/types/roles.type';
import { QubiResponse } from '../qubi/types/qubi-response.type';
import { QubiEntity } from '../qubi/entities/qubi.entity';
import { SignupType } from './types/signup.type';
import { LoginType } from './types/login.type';
import { Payload } from './types/payload.type';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }
    /** Main Helper */
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

    /** Main Function */
    async signup(signup: SignupType): Promise<UserResponse> {
        let user: UserEntity = await this.findByEmail(signup.email);
        if (user)
            throw new UnprocessableEntityException(`User with #email: ${signup.email} already exsist`)
        try {
            user = this.userRepository.create({
                ...signup,
                role: Roles.ADMIN,
                password: await hash(signup.password, 15)
            })
            return this.getBuildUserResponse(await user.save());
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async login(login: LoginType): Promise<string> {
        let user: UserEntity = await this.findByEmail(login.email);
        if (!user) throw new UnauthorizedException(`Invalid Creadential`);

        const isValidPassword: boolean = await compare(login.password, user.password);
        if (!isValidPassword) throw new UnauthorizedException(`Invalid Creadential`);

        const payload: Payload = { email: user.email }
        const accessToken: string = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET
        })
        return accessToken;
    }

    // For resean of Circular dependency

    getBuildUserResponse(user: UserEntity): UserResponse {
        let usersQubi: QubiEntity;
        let qubi: QubiResponse;

        user.qubi ? usersQubi = user.qubi : usersQubi = null;

        if (usersQubi) {
            qubi =
                this.getBuildQubiResponse(user, usersQubi);
        }
        delete user.max_day;
        delete user.max_maney;
        delete user.password;
        return {
            ...user,
            qubi
        }
    }

    getBuildQubiResponse(currentUser: UserEntity, qubi: QubiEntity): QubiResponse {
        let membership: boolean = false;
        let isExpired: boolean = false;
        if (currentUser) {
            currentUser.qubi ?
                membership = currentUser.qubi.id === qubi.id :
                membership = membership;
        }
        const f: Date = qubi.endDate;
        const n: Date = new Date();

        let month: number, day: number = 0;

        if (f.getFullYear() > n.getFullYear()) {
            month = f.getMonth() - n.getMonth() + 12;
            day = f.getDate() - n.getDate();
            day < 0 ? day = day + 30 : day = day;
        }
        if (f.getFullYear() === n.getFullYear()) {
            if (f.getMonth() < n.getMonth()) {
                month = 0;
                day = 0;
                isExpired = true;
            }
            if (f.getMonth() === n.getMonth()) {
                month = 0;
                if (f.getDate() < n.getDate()) {
                    day = 0;
                    isExpired = true;
                } else {
                    day = f.getDate() - n.getDate();
                }
            }
            if (f.getMonth() > n.getMonth()) {
                month = f.getMonth() - n.getMonth();
                day = f.getDate() - n.getDate();
                day < 0 ? day = day + 30 : day = day;
            }

        }
        if (f.getFullYear() < n.getFullYear()) {
            month = 0;
            day = 0;
            isExpired = true;
        }

        return {
            id: qubi.id,
            slug: qubi.slug,
            amount: qubi.amount,
            duration: qubi.duration,
            left_day: `${month}Month : ${day}Day`,
            membership,
            userCount: qubi.userCount,
            isExpired
        }
    }
}

import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import { UserEntity } from '../users/entities/user.entity';
import { UserResponse } from '../users/types/user-response.type';
import { SignupType } from './types/signup.type';
import { LoginType } from './types/login.type';
import { Payload } from './types/payload.type';
import { UsersService } from '../users/users.service';
import { Roles } from 'src/users/types/roles.type';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
    ) { }
    async signup(signup: SignupType): Promise<UserResponse> {
        let user: UserEntity = await this.userService.findByEmail(signup.email);
        if (user)
            throw new UnprocessableEntityException(`User with #email: ${signup.email} already exsist`)
        try {
            user = this.userRepository.create({
                ...signup,
                role: Roles.ADMIN,
                password: await hash(signup.password, 15)
            })
            return this.userService.getBuildUserResponse(await user.save());
        } catch (error) {
            if (error.code === '23505')
                throw new UnprocessableEntityException(`User with #email: ${signup.email} already exsist`)
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async login(login: LoginType): Promise<string> {
        let user: UserEntity = await this.userService.findByEmail(login.email);
        if (!user) throw new UnauthorizedException(`Invalid Creadential`);

        const isValidPassword: boolean = await compare(login.password, user.password);
        if (!isValidPassword) throw new UnauthorizedException(`Invalid Creadential`);

        const payload: Payload = { email: user.email }
        const accessToken: string = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET
        })
        return accessToken;
    }


}

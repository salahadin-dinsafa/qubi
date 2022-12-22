import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions";

import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";


import { UserEntity } from "../../users/entities/user.entity";
import { UserResponse } from "../../users/types/user-response.type";
import { AuthService } from "../auth.service";
import { Payload } from '../types/payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly authService: AuthService,

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: Payload): Promise<UserResponse> {
        const { email }: { email: string } = payload;

        const user: UserEntity = await this.authService.findByEmail(email);

        if (!user)
            throw new UnauthorizedException();

        return this.authService.getBuildUserResponse(user);
    }
}
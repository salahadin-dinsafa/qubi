import { Body, Controller, Post } from '@nestjs/common';

import { UserResponse } from '../users/types/user-response.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /** this functionality inteded only for render server becouse shell is not suppertd in free accound */
    @Post('signup')
    signup(@Body() signupDto: SignupDto): Promise<UserResponse> {
        return this.authService.signup(signupDto)
    }

    @Post()
    login(@Body() loginDto: LoginDto): Promise<string> {
        return this.authService.login(loginDto);
    }
}

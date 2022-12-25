import { Body, Controller, Post, Logger } from '@nestjs/common';

import { ApiCreatedResponse, ApiTags, ApiOperation, ApiUnprocessableEntityResponse } from '@nestjs/swagger/dist';
import { ApiUnauthorizedResponse } from '@nestjs/swagger/dist/decorators';
import { CustomeHttpExceptionResponseObject } from 'src/common/types/http-exception-response.interface';

import { UserResponse, UserResponseObject } from '../users/types/user-response.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@ApiUnprocessableEntityResponse({ type: CustomeHttpExceptionResponseObject })
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    logger = new Logger('AuthController');
    constructor(private readonly authService: AuthService) { }

    /** this functionality inteded only for render server becouse shell is not suppertd in free accound */
    @ApiOperation({ summary: 'User Registration', description: 'Registering user this endpoint is temporary' })
    @ApiCreatedResponse({ type: UserResponseObject })
    @Post('signup')
    signup(@Body() signupDto: SignupDto): Promise<UserResponse> {
        this.logger.verbose(`User signing up with #signupDto: ${signupDto}`)
        return this.authService.signup(signupDto)
    }

    @ApiOperation({ summary: 'Login', description: 'User Logging in' })
    @Post()
    login(@Body() loginDto: LoginDto): Promise<string> {
        this.logger.verbose(`User logging up with #loginDto: ${loginDto}`)
        return this.authService.login(loginDto);
    }
}

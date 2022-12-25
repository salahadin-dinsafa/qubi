import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail, IsString, Matches,
    MinLength, IsNotEmpty
} from "class-validator";


export class SignupDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    firstname: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    lastname: string;

    @ApiProperty({
        example: 'a@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password must contain at least 1 character, 1 number , 1 alphabet  ',
    })
    password: string;
}
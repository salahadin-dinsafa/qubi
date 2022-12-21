import { IsEnum, IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";
import { Roles } from "src/users/types/roles.type";

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    firstname: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    lastname: string;

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
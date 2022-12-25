import { ApiProperty } from "@nestjs/swagger/dist";
import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { number } from "joi";

import { QubiResponse, QubiResponseObject } from "../../qubi/types/qubi-response.type";

export interface UserResponse {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    deposited_maney: number;
    left_maney: number;
    deposited_day: number;
    left_day: number;
    qubi: QubiResponse
}

export class UserResponseObject {
    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    firstname: string;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    lastname: string;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    email: string;

    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    deposited_maney: number;

    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    left_maney: number;

    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    deposited_day: number;

    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    left_day: number;

    @ApiProperty({
        example: {
            id: 'number',
            slug: 'string',
            duration: 'number',
            amount: 'number',
            userCount: 'number',
            left_day: 'string',
            membership: 'boolean',
            isExpired: 'boolean',
        }
    })
    @IsObject()
    @ValidateNested()
    qubi: QubiResponseObject
}
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export interface QubiResponse {
    id: number;
    slug: string;
    duration: number;
    amount: number;
    userCount: number;
    left_day: string;
    membership: boolean;
    isExpired: boolean;
}

export class QubiResponseObject {
    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    slug: string;

    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    duration: number;

    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    userCount: number;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    left_day: string;

    @ApiProperty({
        example: 'boolean'
    })
    @IsBoolean()
    membership: boolean;
    
    @ApiProperty({
        example: 'boolean'
    })
    @IsBoolean()
    isExpired: boolean;
}
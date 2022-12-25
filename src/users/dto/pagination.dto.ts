import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

import {
    IsNumber, IsObject,
    IsOptional, Min, ValidateNested
} from "class-validator";

class QubiElement {
    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(5)
    amount: number;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    duration: number;

}

export class PaginationDto {
    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    limit: number;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    offset: number;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsObject()
    @Type(() => QubiElement)
    @ValidateNested()
    qubi: QubiElement
}


import { Type } from "class-transformer";

import {
    IsNumber, IsObject,
    IsOptional, Min, ValidateNested
} from "class-validator";

class QubiElement {
    @IsOptional()
    @IsNumber()
    @Min(5)
    amount: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    duration: number;
}

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    limit: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    offset: number;

    @IsOptional()
    @IsObject()
    @Type(() => QubiElement)
    @ValidateNested()
    qubi: QubiElement
}


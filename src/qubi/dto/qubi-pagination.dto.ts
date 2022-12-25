import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class QubiPaginationDto {
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
    @IsNumber()
    @Min(0)
    minUser: number;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maxUser: number;
}
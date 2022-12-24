import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class QubiPaginationDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    limit: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    offset: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minUser: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxUser: number;
}
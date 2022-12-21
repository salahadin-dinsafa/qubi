import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class CreateQubiDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(6)
    duration: number;

    @IsOptional()
    @IsNumber()
    @Min(5)
    amount: number;
}
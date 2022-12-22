import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class TransferDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    amount: number;
}
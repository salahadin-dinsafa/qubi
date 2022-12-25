import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { IsNumber, IsString } from "class-validator";

export interface HttpExceptionResponse {
    statusCode: number;
    error: string;
    message?: string;
}

export interface CustomeHttpExceptionResponse extends HttpExceptionResponse {
    method: string;
    path: string;
    timeStamp: string;
}

export class CustomeHttpExceptionResponseObject {
    @ApiProperty({
        example: 'number'
    })
    @IsNumber()
    statusCode: number;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    error: string;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    message: string;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    method: string;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    path: string;

    @ApiProperty({
        example: 'string'
    })
    @IsString()
    timeStamp: string;

}

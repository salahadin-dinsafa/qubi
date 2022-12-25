import { ApiProperty } from "@nestjs/swagger/dist/decorators";

export interface Qubi {
    id: number;
    slug: string;
    duration: number;
    amount: number;
    userCount: number;
    left_day: string;
}

export class QubiObject {
    @ApiProperty({
        example: 'number'
    })
    id: number;
    
    @ApiProperty({
        example: 'string'
    })
    slug: string;
    
    @ApiProperty({
        example: 'number'
    })
    duration: number;
    
    @ApiProperty({
        example: 'number'
    })
    amount: number;
    
    @ApiProperty({
        example: 'number'
    })
    userCount: number;
    
    @ApiProperty({
        example: 'string'
    })
    left_day: string;
}
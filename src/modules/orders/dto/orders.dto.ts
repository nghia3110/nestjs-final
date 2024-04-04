import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
} from 'class-validator';
import { REQUIRED_VALIDATE } from 'src/constants';

export class CreateOrderDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('userId') })
    @ApiProperty({
        type: String,
    })
    userId: string;
}

export class UpdateOrderDto {
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('order status') })
    @ApiProperty({
        type: String,
    })
    status: string;
}
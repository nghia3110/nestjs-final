import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    IsUUID,
} from 'class-validator';
import { POSITIVE_VALIDATE, REQUIRED_VALIDATE } from 'src/constants';

export class CreateOrderDetailDto {
    @IsNumber()
    @IsPositive({ message: POSITIVE_VALIDATE('quantity ordered') })
    @IsNotEmpty({ message: REQUIRED_VALIDATE('quantity ordered') })
    @ApiProperty({
        type: Number,
    })
    quantityOrdered: number;

    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('orderId') })
    @ApiProperty({
        type: String,
    })
    orderId: string;

    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('itemId') })
    @ApiProperty({
        type: String,
    })
    itemId: string;
}

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) { }
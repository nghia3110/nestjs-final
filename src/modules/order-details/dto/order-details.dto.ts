import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    IsUUID,
    ValidateNested,
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

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) { 
    @IsString()
    status: string;
}

export class OrderedItemDetail {
    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('itemId') })
    @ApiProperty({
        type: String,
    })
    itemId: string;

    @IsNumber()
    @IsPositive({ message: POSITIVE_VALIDATE('quantity ordered') })
    @IsNotEmpty({ message: REQUIRED_VALIDATE('quantity ordered') })
    @ApiProperty({
        type: Number,
    })
    quantityOrdered: number;
}

export class CreateManyDetailsDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('orderId') })
    @ApiProperty({
        type: String,
    })
    orderId: string;

    @IsArray()
    @ApiProperty({ type: [OrderedItemDetail] })
    @Type(() => OrderedItemDetail) 
    @ValidateNested({ each: true })
    orderedItems: OrderedItemDetail[];
}
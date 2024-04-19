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

export class CreateRedeemDetailDto {
    @IsNumber()
    @IsPositive({ message: POSITIVE_VALIDATE('quantity redeem') })
    @IsNotEmpty({ message: REQUIRED_VALIDATE('quantity redeem') })
    @ApiProperty({
        type: Number,
    })
    quantityRedeem: number;

    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('orderId') })
    @ApiProperty({
        type: String,
    })
    redeemId: string;

    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('itemId') })
    @ApiProperty({
        type: String,
    })
    itemId: string;
}

export class UpdateRedeemDetailDto extends PartialType(CreateRedeemDetailDto) { 
    status?: string;
}

export class RedeemItemDetail {
    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('itemId') })
    @ApiProperty({
        type: String,
    })
    itemId: string;

    @IsNumber()
    @IsPositive({ message: POSITIVE_VALIDATE('quantity redeem') })
    @IsNotEmpty({ message: REQUIRED_VALIDATE('quantity redeem') })
    @ApiProperty({
        type: Number,
    })
    quantityRedeem: number;
}

export class CreateManyRedeemDetailsDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('redeemId') })
    @ApiProperty({
        type: String,
    })
    redeemId: string;

    @IsArray()
    @ApiProperty({ type: [RedeemItemDetail] })
    @Type(() => RedeemItemDetail) 
    @ValidateNested({ each: true })
    redeemItems: RedeemItemDetail[];
}
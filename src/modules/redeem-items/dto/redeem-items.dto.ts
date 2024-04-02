import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Literal } from 'sequelize/types/utils';
import { POSITIVE_VALIDATE, REQUIRED_VALIDATE } from 'src/constants';

export class CreateRedeemItemDto {
  @IsString()
  @IsNotEmpty({ message: REQUIRED_VALIDATE('item name')})
  @ApiProperty({
    type: String,
    description: 'RedeemItem name',
    example: 'RedeemItem 1',
  })
  name: string;

  @IsNumber()
  @IsPositive({message: POSITIVE_VALIDATE('exchange point')})
  @IsNotEmpty({message: REQUIRED_VALIDATE('exchange point')})
  @ApiProperty({
    type: Number,
    description: 'Exchange point',
    example: 200
  })
  exchangePoint: number;

  @IsNumber()
  @IsPositive({message: POSITIVE_VALIDATE('quantity')})
  @IsNotEmpty({ message: REQUIRED_VALIDATE('quantity') })
  @ApiProperty({
    type: Number,
    description: 'Quantity',
    example: 20
  })
  quantity: number;

  @IsString()
  @IsDateString()
  @IsNotEmpty({message: REQUIRED_VALIDATE('expired time')})
  @ApiProperty({
    type: String,
    description: 'Expired time',
  })
  expiredTime: string;

  @ApiProperty({
    type: String,
    description: 'Photo',
  })
  photo: string;

  @ApiProperty({
    type: String,
    description: 'Description',
  })
  description: string;
}

export class UpdateRedeemItemDto extends PartialType(CreateRedeemItemDto) {}

export class UpdateRedeemItemQuantityDto {
  @IsUUID()
  @IsString()
  id: string;

  quantity: Literal;
}
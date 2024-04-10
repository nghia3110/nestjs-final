import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { POSITIVE_VALIDATE, REQUIRED_VALIDATE } from 'src/constants';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty({ message: REQUIRED_VALIDATE('item name') })
  @ApiProperty({
    type: String,
    description: 'Item name',
    example: 'Item 1',
  })
  name: string;

  @IsNumber()
  @IsPositive({ message: POSITIVE_VALIDATE('price') })
  @IsNotEmpty({ message: REQUIRED_VALIDATE('price') })
  @ApiProperty({
    type: Number,
    description: 'Price',
    example: '20000'
  })
  price: number;

  @IsNumber()
  @IsPositive({ message: POSITIVE_VALIDATE('quantity') })
  @IsNotEmpty({ message: REQUIRED_VALIDATE('quantity') })
  @ApiProperty({
    type: Number,
    description: 'Quantity in stock',
    example: '20'
  })
  quantityInStock: number;

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

export class UpdateItemDto extends PartialType(CreateItemDto) { }

export class CreateArrayItemDto {
  @IsArray()
  @Type(() => CreateItemDto) 
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [CreateItemDto]
  })
  items: CreateItemDto[];
}
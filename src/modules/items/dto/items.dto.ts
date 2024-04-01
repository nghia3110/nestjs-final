import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Literal } from 'sequelize/types/utils';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty({ message: "The item name field is required!" })
  @ApiProperty({
    type: String,
    description: 'Item name',
    example: 'Item 1',
  })
  name: string;

  @IsNumber()
  @IsPositive({message: "The Price must be greater than 0!"})
  @IsNotEmpty({message: "The Price field is required!"})
  @ApiProperty({
    type: Number,
    description: 'Price',
    example: '20000'
  })
  price: number;

  @IsNumber()
  @IsPositive({message: "The Quantity must be greater than 0!"})
  @IsNotEmpty({ message: "The Quantity field is required!" })
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

  @IsUUID()
  @IsString()
  @IsNotEmpty({ message: "The store field is required!" })
  @ApiProperty({
    type: String,
  })
  storeId: string;
}

export class UpdateItemDto extends PartialType(CreateItemDto) {}

export class UpdateItemQuantityDto {
  @IsUUID()
  @IsString()
  id: string;

  quantityInStock: Literal;
}
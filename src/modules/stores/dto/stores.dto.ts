import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength
} from 'class-validator';

export class GetListStoresDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: "The store name field is required!" })
  @ApiProperty({
    type: String,
    description: 'Store name',
    example: 'Store 1',
  })
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty({message: "The Email field is required!"})
  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'example@gmail.com'
  })
  email: string;

  @IsString()
  @MaxLength(32, { message: 'The Password field is less than 32 characters.' })
  @MinLength(6, { message: 'The Password field is from 6 characters or more' })
  @IsNotEmpty({ message: "The Password field is required!" })
  @ApiProperty({
    type: String,
    description: 'Password',
    example: '235689@Jkl'
  })
  password: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Address',
    example: 'Hanoi'
  })
  address: string;

  @IsString()
  @IsNumberString()
  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '0913289351'
  })
  phoneNumber: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty({ message: "The method field is required!" })
  @ApiProperty({
    type: String,
    description: 'Accumulate method',
  })
  methodId: string;
}

export class UpdateStoreDto extends OmitType(PartialType(CreateStoreDto), ['password'] as const) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'Set store is verified or not',
    example: true,
  })
  isVerified: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'Set store is approved',
    example: true,
  })
  isApproved: boolean;
}

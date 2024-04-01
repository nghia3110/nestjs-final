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
import { MAX_LENGTH_VALIDATE, MIN_LENGTH_VALIDATE, REQUIRED_VALIDATE } from 'src/constants';

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
  @IsNotEmpty({ message: REQUIRED_VALIDATE('store name') })
  @ApiProperty({
    type: String,
    description: 'Store name',
    example: 'Store 1',
  })
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: REQUIRED_VALIDATE('email') })
  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'example@gmail.com'
  })
  email: string;

  @IsString()
  @MaxLength(32, { message: MAX_LENGTH_VALIDATE('password', 32) })
  @MinLength(6, { message: MIN_LENGTH_VALIDATE('password', 6) })
  @IsNotEmpty({ message: REQUIRED_VALIDATE('password') })
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
  @IsNotEmpty({ message: REQUIRED_VALIDATE('method') })
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

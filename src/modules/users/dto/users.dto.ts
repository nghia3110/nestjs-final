import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { MAX_LENGTH_VALIDATE, MIN_LENGTH_VALIDATE, REQUIRED_VALIDATE } from 'src/constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: REQUIRED_VALIDATE('firstname') })
  @ApiProperty({
    type: String,
    description: 'First name',
    example: 'Nghia',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: REQUIRED_VALIDATE('lastname')  })
  @ApiProperty({
    type: String,
    description: 'Last name',
    example: 'Ha',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: REQUIRED_VALIDATE('phonenumber')  })
  @IsNumberString()
  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '0913289351'
  })
  phoneNumber: string;

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

  @IsEmail()
  @IsString()
  @IsNotEmpty({message: REQUIRED_VALIDATE('email')})
  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'example@gmail.com'
  })
  email: string;
}

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ['password'] as const) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'Set user is verified or not',
    example: true,
  })
  isVerified?: boolean;

  @IsNumber()
  @IsOptional()
  totalPoints?: number;

  @IsNumber()
  @IsOptional()
  currentPoints?: number;
}

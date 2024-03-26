import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class GetListUserDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: "The firstname field is required!" })
  @ApiProperty({
    type: String,
    description: 'First name',
    example: 'Nghia',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "The lastname field is required!" })
  @ApiProperty({
    type: String,
    description: 'Last name',
    example: 'Ha',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: "The phonenumber field is required!" })
  @IsNumberString()
  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '0913289351'
  })
  phoneNumber: string;

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

  @IsEmail()
  @IsString()
  @IsNotEmpty({message: "The Email field is required!"})
  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'example@gmail.com'
  })
  email: string;
}

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'Set user is verified or not',
    example: true,
  })
  isVerified: boolean;
}

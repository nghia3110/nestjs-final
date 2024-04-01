import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  MAX_LENGTH_VALIDATE,
  MIN_LENGTH_VALIDATE,
  REQUIRED_VALIDATE
} from 'src/constants';

export class LoginDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: REQUIRED_VALIDATE('email') })
  @ApiProperty({
    type: String,
    description: 'Your email',
    example: 'example@gmail.com',
  })
  email: string;

  @IsString()
  @MaxLength(32, { message: MAX_LENGTH_VALIDATE('password', 32) })
  @MinLength(6, { message: MIN_LENGTH_VALIDATE('password', 6) })
  @IsNotEmpty({ message: REQUIRED_VALIDATE('password') })
  @ApiProperty({
    type: String,
    description: 'Your password',
    example: 'password',
  })
  password: string;
}

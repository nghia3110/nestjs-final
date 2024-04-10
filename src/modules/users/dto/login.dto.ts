import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  MAX_LENGTH_VALIDATE,
  MIN_LENGTH_VALIDATE,
  REQUIRED_VALIDATE
} from 'src/constants';

export class LoginUserDto {
  @IsString()
  @IsNumberString()
  @IsNotEmpty({ message: REQUIRED_VALIDATE('phone number') })
  @ApiProperty({
    type: String,
    description: 'Your phone number',
    example: '0123456789',
  })
  phoneNumber: string;

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

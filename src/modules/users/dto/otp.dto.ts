import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class SendUserOTPDto {
  @IsString()
  @IsNumberString()
  @ApiProperty({
    type: String,
    description: 'Your phone number',
    example: '0123456789',
  })
  phoneNumber: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Your hash',
    example: 'string',
  })
  hash: string;
}

export class VerifyUserOTPDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The OTP you received',
    example: '8888',
  })
  otp: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Your hash',
    example: 'string',
  })
  hash: string;
}

export class ForgetPasswordDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Your new password',
    example: 'newpassword',
  })
  newPassword: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Your hash',
    example: 'string',
  })
  hash: string;
}

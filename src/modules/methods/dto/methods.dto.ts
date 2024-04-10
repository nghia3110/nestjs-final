import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { REQUIRED_VALIDATE } from 'src/constants';

export class CreateMethodDto {
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('method name') })
    @ApiProperty({
        type: String,
    })
    name: string;
}

export class UpdateMethodDto extends PartialType(CreateMethodDto) { }
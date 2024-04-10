import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';
import { REQUIRED_VALIDATE } from 'src/constants';

export class CreateMethodDetailDto {
    @IsNumber()
    @Min(0)
    @IsNotEmpty({ message: REQUIRED_VALIDATE('fixed point') })
    @ApiProperty({
        type: Number
    })
    fixedPoint: number;

    @IsNumber()
    @Min(0)
    @IsNotEmpty({ message: REQUIRED_VALIDATE('fixed point') })
    @ApiProperty({
        type: Number
    })
    maxPoint: number;

    @IsNumber()
    @Min(0)
    @IsNotEmpty({ message: REQUIRED_VALIDATE('fixed point') })
    @ApiProperty({
        type: Number
    })
    percentage: number;

    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('method') })
    @ApiProperty({
        type: String
    })
    methodId: string;

    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('rank') })
    @ApiProperty({
        type: String
    })
    rankId: string;
}

export class UpdateMethodDetailDto extends PartialType(CreateMethodDetailDto) { }
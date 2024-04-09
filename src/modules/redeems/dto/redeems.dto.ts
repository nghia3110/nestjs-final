import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
} from 'class-validator';
import { REQUIRED_VALIDATE } from 'src/constants';

export class CreateRedeemDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('store') })
    @ApiProperty({
        type: String,
    })
    storeId: string;
}

export class UpdateRedeemDto {
    @IsString()
    @IsNotEmpty({ message: REQUIRED_VALIDATE('redeem status') })
    @ApiProperty({
        type: String,
    })
    status: string;
}
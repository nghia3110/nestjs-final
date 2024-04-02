import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { FIRST_PAGE, LIMIT_PAGE } from "src/constants";

export class PaginateDto {
    @IsOptional()
    @IsNumberString()
    @ApiProperty({
        required: false,
        default: FIRST_PAGE
    })
    page?: string;

    @IsOptional()
    @IsNumberString()
    @ApiProperty({
        required: false,
        default: LIMIT_PAGE
    })
    limit?: string;
}

export class GetListDto extends PaginateDto{
    @IsOptional()
    @IsString()
    searchText?: string;
}
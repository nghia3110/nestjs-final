import { IsNumberString, IsOptional } from "class-validator";

export class GetListDto {
    @IsOptional()
    @IsNumberString()
    page?: string;

    @IsOptional()
    @IsNumberString()
    limit?: string;
}
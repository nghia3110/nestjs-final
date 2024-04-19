import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetListDto } from 'src/database';
import { AdminGuard, UserGuard, UuidParam } from 'src/utils';
import { RedeemDetailsService } from './redeem-details.service';

@ApiTags('redeem-details')
@Controller('redeem-details')
export class RedeemDetailsController {
    constructor(private redeemDetailsService: RedeemDetailsService) { }

    @ApiOperation({ summary: 'API get list redeem details' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListRedeemDetails(
        @Query() query: GetListDto) {
        return this.redeemDetailsService.getListRedeemDetails(query);
    }

    @ApiOperation({ summary: 'API get redeem detail by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getRedeemDetailById(@UuidParam('id') id: string) {
        return this.redeemDetailsService.getRedeemDetailById(id);
    }

    @ApiOperation({ summary: 'API delete redeem detail' })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteRedeemDetail(@UuidParam('id') id: string) {
        return this.redeemDetailsService.deleteRedeemDetail(id);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetListDto } from 'src/database';
import { TUser } from 'src/types';
import { AdminGuard, User, UserGuard, UuidParam } from 'src/utils';
import {
    CreateManyRedeemDetailsDto,
    CreateRedeemDetailDto,
    RedeemDetailsService,
    UpdateRedeemDetailDto
} from '../redeem-details';
import {
    UpdateRedeemDto
} from './dto';
import { RedeemsService } from './redeems.service';

@ApiTags('redeems')
@Controller('redeems')
export class RedeemsController {
    constructor(
        private redeemsService: RedeemsService,
    ) { }

    @ApiOperation({ summary: 'API get list redeems' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListRedeems(
        @Query() query: GetListDto) {
        return this.redeemsService.getListRedeems(query);
    }

    @ApiOperation({ summary: 'API get redeem by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getRedeemById(@UuidParam('id') id: string) {
        return this.redeemsService.getRedeemById(id);
    }

    @ApiOperation({ summary: 'API update redeem' })
    @ApiBody({
        type: UpdateRedeemDto,
        required: true,
        description: 'User update redeem'
    })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateRedeem(@UuidParam('id') id: string, @Body() payload: UpdateRedeemDto, @User() user: TUser) {
        return this.redeemsService.updateRedeem(id, payload, user.id);
    }

    @ApiOperation({ summary: 'API update redeem detail' })
    @ApiBody({
        type: UpdateRedeemDetailDto,
        required: true,
        description: 'Update redeem detail'
    })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Put('/redeem-details/:id')
    @HttpCode(201)
    async updateRedeemDetail(@UuidParam('id') id: string, @Body() payload: UpdateRedeemDetailDto) {
        return this.redeemsService.updateRedeemDetail(id, payload);
    }

    @ApiOperation({ summary: 'API delete redeem' })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteRedeem(@UuidParam('id') id: string, @User() user: TUser) {
        return this.redeemsService.deleteRedeem(id, user.id);
    }

    @ApiOperation({ summary: 'API create redeem details' })
    @ApiBody({
        type: CreateManyRedeemDetailsDto,
        required: true,
        description: 'Create redeem details'
    })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Post('/redeem-details/create-many')
    @HttpCode(201)
    async createManyRedeemDetails(@Body() payload: CreateManyRedeemDetailsDto) {
        return this.redeemsService.createManyRedeemDetails(payload);
    }

    @ApiOperation({ summary: 'API create redeem detail' })
    @ApiBody({
        type: CreateRedeemDetailDto,
        required: true,
        description: 'Create redeem detail'
    })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Post('/redeem-details')
    @HttpCode(201)
    async createRedeemDetail(@Body() payload: CreateRedeemDetailDto) {
        return this.redeemsService.createRedeemDetail(payload);
    }
}

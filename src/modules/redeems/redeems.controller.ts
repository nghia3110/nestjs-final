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
    CreateManyDetailsDto,
    CreateRedeemDetailDto,
    RedeemDetailsService,
    UpdateRedeemDetailDto
} from '../redeem-details';
import {
    CreateRedeemDto,
    UpdateRedeemDto
} from './dto';
import { RedeemsService } from './redeems.service';

@ApiTags('redeems')
@Controller('redeems')
export class RedeemsController {
    constructor(
        private redeemsService: RedeemsService,
        private redeemDetailsService: RedeemDetailsService
    ) { }

    @ApiOperation({ summary: 'API get list redeems' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListRedeems(
        @Query() query: GetListDto) {
        return await this.redeemsService.getListRedeems(query);
    }

    @ApiOperation({ summary: 'API get redeem by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getRedeemById(@UuidParam('id') id: string) {
        return await this.redeemsService.getRedeemById(id);
    }

    @ApiOperation({ summary: 'API create redeem' })
    @ApiBearerAuth()
    @ApiBody({
        type: CreateRedeemDto,
        required: true,
        description: 'User create redeem'
    })
    @UseGuards(UserGuard)
    @Post()
    @HttpCode(201)
    async createRedeem(@Body() payload: CreateRedeemDto, @User() user: TUser) {
        return await this.redeemsService.createRedeem(payload, user.id);
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
        return await this.redeemsService.updateRedeem(id, payload, user.id);
    }

    @ApiOperation({ summary: 'API delete redeem' })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteRedeem(@UuidParam('id') id: string, @User() user: TUser) {
        return await this.redeemsService.deleteRedeem(id, user.id);
    }

    @ApiOperation({ summary: 'API create redeem detail' })
    @ApiBody({
        type: CreateRedeemDetailDto,
        required: true,
        description: 'Create redeem detail'
    })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Post()
    @HttpCode(201)
    async createRedeemDetail(@Body() payload: CreateRedeemDetailDto) {
        return await this.redeemDetailsService.createRedeemDetail(payload);
    }

    @ApiOperation({ summary: 'API create redeem details' })
    @ApiBody({
        type: CreateManyDetailsDto,
        required: true,
        description: 'Create redeem details'
    })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Post('/create-many')
    @HttpCode(201)
    async createManyRedeemDetails(@Body() payload: CreateManyDetailsDto) {
        return await this.redeemDetailsService.createManyRedeemDetails(payload);
    }

    @ApiOperation({ summary: 'API update redeem detail' })
    @ApiBody({
        type: UpdateRedeemDetailDto,
        required: true,
        description: 'Update redeem detail'
    })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateRedeemDetail(@UuidParam('id') id: string, @Body() payload: UpdateRedeemDetailDto) {
        return await this.redeemDetailsService.updateRedeemDetail(id, payload);
    }
}

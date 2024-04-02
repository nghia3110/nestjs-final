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
import { TStore } from 'src/types';
import { AdminGuard, Store, StoreGuard, UuidParam } from 'src/utils';
import {
    CreateRedeemItemDto,
    UpdateRedeemItemDto,
} from './dto';
import { RedeemItemsService } from './redeem-items.service';

@ApiTags('redeem-items')
@Controller('redeem-items')
export class RedeemItemsController {
    constructor(private redeemItemsService: RedeemItemsService) { }

    @ApiOperation({ summary: 'API get list redeemItems' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListRedeemItems(
        @Query('page') page?: string,
        @Query('limit') limit?: string) {
        const paginateInfo = { page, limit } as GetListDto;
        return await this.redeemItemsService.getListRedeemItems(paginateInfo);
    }

    @ApiOperation({ summary: 'API get redeemItem by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getRedeemItemById(@UuidParam('id') id: string) {
        return await this.redeemItemsService.getRedeemItemById(id);
    }

    @ApiOperation({ summary: 'API create redeemItem' })
    @ApiBody({
        type: CreateRedeemItemDto,
        required: true,
        description: 'Store create redeemItem'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post()
    @HttpCode(201)
    async createRedeemItem(@Body() payload: CreateRedeemItemDto, @Store() store: TStore) {
        return await this.redeemItemsService.createRedeemItem(payload, store);
    }

    @ApiOperation({ summary: 'API create redeem items' })
    @ApiBody({
        type: CreateRedeemItemDto,
        required: true,
        description: 'Store create redeem items'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post('/create-many')
    @HttpCode(201)
    async createManyRedeemItems(@Body() payload: CreateRedeemItemDto[], @Store() store: TStore) {
        return await this.redeemItemsService.createManyRedeemItems(payload, store);
    }

    @ApiOperation({ summary: 'API update redeemItem' })
    @ApiBody({
        type: UpdateRedeemItemDto,
        required: true,
        description: 'Store update redeemItem'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateRedeemItem(@UuidParam('id') id: string, @Body() payload: UpdateRedeemItemDto, @Store() store: TStore) {
        return await this.redeemItemsService.updateRedeemItem(id, payload, store);
    }

    @ApiOperation({ summary: 'API delete redeemItem' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteRedeemItem(@UuidParam('id') id: string, @Store() store: TStore) {
        await this.redeemItemsService.deleteRedeemItem(id, store);
    }
}

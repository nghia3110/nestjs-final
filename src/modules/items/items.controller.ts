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
    CreateArrayItemDto,
    CreateItemDto,
    UpdateItemDto,
} from './dto';
import { ItemsService } from './items.service';

@ApiTags('items')
@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService) { }

    @ApiOperation({ summary: 'API get list items' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListItems(
        @Query() query: GetListDto) {
        return await this.itemsService.getListItems(query);
    }

    @ApiOperation({ summary: 'API get item by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getItemById(@UuidParam('id') id: string) {
        return await this.itemsService.getItemById(id);
    }

    @ApiOperation({ summary: 'API create item' })
    @ApiBody({
        type: CreateItemDto,
        required: true,
        description: 'Store create item'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post()
    @HttpCode(201)
    async createItem(@Body() payload: CreateItemDto, @Store() store: TStore) {
        return await this.itemsService.createItem(payload, store);
    }

    @ApiOperation({ summary: 'API create item' })
    @ApiBody({
        type: CreateArrayItemDto,
        required: true,
        description: 'Store create item'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post('/create-many')
    @HttpCode(201)
    async createManyItems(@Body() payload: CreateArrayItemDto, @Store() store: TStore) {
        return await this.itemsService.createManyItems(payload, store);
    }

    @ApiOperation({ summary: 'API update item' })
    @ApiBody({
        type: UpdateItemDto,
        required: true,
        description: 'Store update item'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateItem(@UuidParam('id') id: string, @Body() payload: UpdateItemDto, @Store() store: TStore) {
        return await this.itemsService.updateItem(id, payload, store);
    }

    @ApiOperation({ summary: 'API delete item' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteItem(@UuidParam('id') id: string, @Store() store: TStore) {
        return await this.itemsService.deleteItem(id, store);
    }
}

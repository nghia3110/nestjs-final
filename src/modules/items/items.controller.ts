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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
    CreateItemDto,
    UpdateItemDto,
} from './dto';
import { ItemsService } from './items.service';
import { AdminGuard, UuidParam } from 'src/utils';
import { GetListDto } from 'src/database';

@ApiTags('items')
@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService) { }

    @ApiOperation({ summary: 'API get list items' })
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListItems(
        @Query('page') page?: string,
        @Query('limit') limit?: string) {
        const paginateInfo = { page, limit } as GetListDto;
        return await this.itemsService.getListItems(paginateInfo);
    }

    @ApiOperation({ summary: 'API get item by Id' })
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
        description: 'Admin create item'
    })
    @UseGuards(AdminGuard)
    @Post()
    @HttpCode(201)
    async createItem(@Body() payload: CreateItemDto) {
        return await this.itemsService.createItem(payload);
    }

    @ApiOperation({ summary: 'API update item' })
    @ApiBody({
        type: UpdateItemDto,
        required: true,
        description: 'Admin update item'
    })
    @UseGuards(AdminGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateItem(@UuidParam('id') id: string, @Body() payload: UpdateItemDto) {
        return await this.itemsService.updateItem(id, payload);
    }

    @ApiOperation({ summary: 'API delete item' })
    @UseGuards(AdminGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteItem(@UuidParam('id') id: string) {
        await this.itemsService.deleteItem(id);
    }
}

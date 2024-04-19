import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetListDto } from 'src/database';
import { TStore } from 'src/types';
import { AdminGuard, Store, StoreGuard, UuidParam } from 'src/utils';
import {
    CreateArrayItemDto,
    CreateItemDto,
    UpdateItemDto,
} from './dto';
import { ItemsService } from './items.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, multerOptions } from '../uploads';

@ApiTags('items')
@Controller('items')
export class ItemsController {
    constructor(
        private itemsService: ItemsService,
        private uploadService: UploadService
    ) { }

    @ApiOperation({ summary: 'API get list items' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListItems(
        @Query() query: GetListDto) {
        return this.itemsService.getListItems(query);
    }

    @ApiOperation({ summary: 'API get item by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getItemById(@UuidParam('id') id: string) {
        return this.itemsService.getItemById(id);
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
    async createItem(
        @Body() payload: CreateItemDto,
        @Store() store: TStore
    ) {
        return this.itemsService.createItem(payload, store);
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
        return this.itemsService.createManyItems(payload, store);
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
        return this.itemsService.updateItem(id, payload, store);
    }

    @ApiOperation({ summary: 'API delete item' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteItem(@UuidParam('id') id: string, @Store() store: TStore) {
        return this.itemsService.deleteItem(id, store);
    }

    @ApiOperation({ summary: 'API upload image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
        required: true,
        description: 'Upload image',
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post('/:id/upload-image')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('image', multerOptions.imageFilter))
    async multerUpload(
        @UuidParam('id') itemId: string,
        @UploadedFile('') image: Express.Multer.File) {
        const result = await this.uploadService.multerUpload(image);
        return this.itemsService.saveImageForItem(itemId, result.url);
    }
}

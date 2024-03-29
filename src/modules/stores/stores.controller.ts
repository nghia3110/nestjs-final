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
    CreateStoreDto,
    GetListStoresDto,
    UpdateStoreDto,
} from './dto';
import { StoresService } from './stores.service';
import { AdminGuard, UuidParam } from 'src/utils';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) { }

    @ApiOperation({ summary: 'API get list stores' })
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListStores(
        @Query('page') page?: string,
        @Query('limit') limit?: string) {
        const paginateInfo = { page, limit } as GetListStoresDto;
        return await this.storesService.getListStores(paginateInfo);
    }

    @ApiOperation({ summary: 'API get store by Id' })
    @UseGuards(AdminGuard)
    @Get(':id')
    @HttpCode(200)
    async getStoreById(@UuidParam('id') id: string) {
        return await this.storesService.getStoreById(id);
    }

    @ApiOperation({ summary: 'API create store' })
    @ApiBody({
        type: CreateStoreDto,
        required: true,
        description: 'Admin create store'
    })
    @UseGuards(AdminGuard)
    @Post()
    @HttpCode(201)
    async createStore(@Body() payload: CreateStoreDto) {
        return await this.storesService.createStore(payload);
    }

    @ApiOperation({ summary: 'API update store' })
    @ApiBody({
        type: UpdateStoreDto,
        required: true,
        description: 'Admin update store'
    })
    @UseGuards(AdminGuard)
    @Put(':id')
    @HttpCode(201)
    async updateStore(@UuidParam('id') id: string, @Body() payload: UpdateStoreDto) {
        return await this.storesService.updateStore(id, payload);
    }

    @ApiOperation({ summary: 'API delete store' })
    @UseGuards(AdminGuard)
    @Delete(':id')
    @HttpCode(200)
    async deleteStore(@UuidParam('id') id: string) {
        await this.storesService.deleteStore(id);
    }

    @ApiOperation({ summary: 'API approve store' })
    @UseGuards(AdminGuard)
    @Put('approve/:id')
    @HttpCode(201)
    async approveStore(@UuidParam('id') id: string) {
        return await this.storesService.approveStore(id);
    }
}

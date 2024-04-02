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

import { GetListDto } from 'src/database';
import { TStore } from 'src/types';
import { AdminGuard, Store, StoreGuard, UuidParam } from 'src/utils';
import {
    CreateOrderDto,
    UpdateOrderDto
} from './dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @ApiOperation({ summary: 'API get list orders' })
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListOrders(
        @Query('page') page?: string,
        @Query('limit') limit?: string) {
        const paginateInfo = { page, limit } as GetListDto;
        return await this.ordersService.getListOrders(paginateInfo);
    }

    @ApiOperation({ summary: 'API get order by Id' })
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getOrderById(@UuidParam('id') id: string) {
        return await this.ordersService.getOrderById(id);
    }

    @ApiOperation({ summary: 'API create order' })
    @ApiBody({
        type: CreateOrderDto,
        required: true,
        description: 'Store create order'
    })
    @UseGuards(StoreGuard)
    @Post()
    @HttpCode(201)
    async createOrder(@Body() payload: CreateOrderDto, @Store() store: TStore) {
        return await this.ordersService.createOrder(payload, store);
    }

    @ApiOperation({ summary: 'API update order' })
    @ApiBody({
        type: UpdateOrderDto,
        required: true,
        description: 'Store update order'
    })
    @UseGuards(StoreGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateOrder(@UuidParam('id') id: string, @Body() payload: UpdateOrderDto, @Store() store: TStore) {
        return await this.ordersService.updateOrder(id, payload, store);
    }

    @ApiOperation({ summary: 'API delete order' })
    @UseGuards(StoreGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteOrder(@UuidParam('id') id: string, @Store() store: TStore) {
        await this.ordersService.deleteOrder(id, store);
    }
}
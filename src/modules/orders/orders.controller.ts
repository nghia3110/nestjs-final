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
    CreateManyDetailsDto,
    CreateOrderDetailDto,
    OrderDetailsService,
    UpdateOrderDetailDto,
} from '../order-details';
import {
    CreateOrderDto,
    UpdateOrderDto
} from './dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService,
        private orderDetailsService: OrderDetailsService
    ) { }

    @ApiOperation({ summary: 'API get list orders' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListOrders(
        @Query() query: GetListDto) {
        return this.ordersService.getListOrders(query);
    }

    @ApiOperation({ summary: 'API get order by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getOrderById(@UuidParam('id') id: string) {
        return this.ordersService.getOrderById(id);
    }

    @ApiOperation({ summary: 'API update order detail' })
    @ApiBody({
        type: UpdateOrderDetailDto,
        required: true,
        description: 'Update order detail'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Put('/order-details/:id')
    @HttpCode(201)
    async updateOrderDetail(@UuidParam('id') id: string, @Body() payload: UpdateOrderDetailDto) {
        return this.ordersService.updateOrderDetail(id, payload);
    }

    @ApiOperation({ summary: 'API update order' })
    @ApiBody({
        type: UpdateOrderDto,
        required: true,
        description: 'Store update order'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateOrder(@UuidParam('id') id: string, @Body() payload: UpdateOrderDto, @Store() store: TStore) {
        return this.ordersService.updateOrder(id, payload, store.id);
    }

    @ApiOperation({ summary: 'API delete order' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteOrder(@UuidParam('id') id: string, @Store() store: TStore) {
        return this.ordersService.deleteOrder(id, store.id);
    }

    @ApiOperation({ summary: 'API create order details' })
    @ApiBody({
        type: CreateManyDetailsDto,
        required: true,
        description: 'Create order details'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post('/order-details/create-many')
    @HttpCode(201)
    async createManyOrderDetails(@Body() payload: CreateManyDetailsDto) {
        return this.ordersService.createManyOrderDetails(payload);
    }

    @ApiOperation({ summary: 'API create order detail' })
    @ApiBody({
        type: CreateOrderDetailDto,
        required: true,
        description: 'Create order detail'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post('/order-details')
    @HttpCode(201)
    async createOrderDetail(@Body() payload: CreateOrderDetailDto) {
        return this.ordersService.createOrderDetail(payload);
    }
}
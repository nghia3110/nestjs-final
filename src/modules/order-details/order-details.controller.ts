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
import { AdminGuard, StoreGuard, UuidParam } from 'src/utils';
import {
    CreateManyDetailsDto,
    CreateOrderDetailDto,
    UpdateOrderDetailDto,
} from './dto';
import { OrderDetailsService } from './order-details.service';

@ApiTags('order-details')
@Controller('order-details')
export class OrderDetailsController {
    constructor(private orderDetailsService: OrderDetailsService) { }

    @ApiOperation({ summary: 'API get list order details' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListOrderDetails(
        @Query() query: GetListDto) {
        return await this.orderDetailsService.getListOrderDetails(query);
    }

    @ApiOperation({ summary: 'API get order detail by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getOrderDetailById(@UuidParam('id') id: string) {
        return await this.orderDetailsService.getOrderDetailById(id);
    }

    @ApiOperation({ summary: 'API create order detail' })
    @ApiBody({
        type: CreateOrderDetailDto,
        required: true,
        description: 'Create order detail'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post()
    @HttpCode(201)
    async createOrderDetail(@Body() payload: CreateOrderDetailDto) {
        return await this.orderDetailsService.createOrderDetail(payload);
    }

    @ApiOperation({ summary: 'API create order details' })
    @ApiBody({
        type: CreateManyDetailsDto,
        required: true,
        description: 'Create order details'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post('/create-many')
    @HttpCode(201)
    async createManyOrderDetails(@Body() payload: CreateManyDetailsDto) {
        return await this.orderDetailsService.createManyOrderDetails(payload);
    }

    @ApiOperation({ summary: 'API update order detail' })
    @ApiBody({
        type: UpdateOrderDetailDto,
        required: true,
        description: 'Update order detail'
    })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateOrderDetail(@UuidParam('id') id: string, @Body() payload: UpdateOrderDetailDto) {
        return await this.orderDetailsService.updateOrderDetail(id, payload);
    }

    @ApiOperation({ summary: 'API delete order detail' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteOrderDetail(@UuidParam('id') id: string) {
        return await this.orderDetailsService.deleteOrderDetail(id);
    }
}

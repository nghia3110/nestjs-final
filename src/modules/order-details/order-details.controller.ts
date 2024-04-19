import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetListDto } from 'src/database';
import { AdminGuard, StoreGuard, UuidParam } from 'src/utils';
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
        return this.orderDetailsService.getListOrderDetails(query);
    }

    @ApiOperation({ summary: 'API get order detail by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getOrderDetailById(@UuidParam('id') id: string) {
        return this.orderDetailsService.getOrderDetailById(id);
    }

    @ApiOperation({ summary: 'API delete order detail' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteOrderDetail(@UuidParam('id') id: string) {
        return this.orderDetailsService.deleteOrderDetail(id);
    }
}

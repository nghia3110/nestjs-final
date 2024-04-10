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
import { AdminGuard, Store, StoreGuard, UserGuard, UuidParam } from 'src/utils';
import { ItemsService } from '../items';
import { OrdersService } from '../orders';
import { RedeemItemsService } from '../redeem-items';
import { UserOrderService } from '../user-order';
import {
    CreateStoreDto,
    UpdateStoreDto,
} from './dto';
import { LoginDto } from './dto/login.dto';
import { SendOTPDto, VerifyOTPDto } from './dto/otp.dto';
import { StoresService } from './stores.service';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
    constructor(
        private storesService: StoresService,
        private userOrderService: UserOrderService,
        private ordersService: OrdersService,
        private itemsService: ItemsService,
        private redeemItemsService: RedeemItemsService
        ) { }

    @ApiOperation({ summary: 'API get list stores' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListStores(
        @Query() query: GetListDto) {
        return await this.storesService.getListStores(query);
    }

    @ApiOperation({ summary: 'API get users in store' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Get('/users')
    @HttpCode(200)
    async getUsersInStore(
        @Store() store: TStore,
        @Query() query: GetListDto,
    ) {
        return await this.userOrderService.getUsersInStore(store.id, query);
    }

    @ApiOperation({ summary: 'API get orders in store' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Get('/orders')
    @HttpCode(200)
    async getOrdersInStore(
        @Store() store: TStore,
        @Query() query: GetListDto,
    ) {
        return await this.ordersService.paginateOrdersInStore(store.id, query);
    }

    @ApiOperation({ summary: 'API get items in store' })
    @UseGuards(UserGuard, StoreGuard)
    @ApiBearerAuth()
    @Get('/:storeId/items')
    @HttpCode(200)
    async getItemsInStore(
        @UuidParam('storeId') storeId: string,
        @Query() query: GetListDto,
    ) {
        return await this.itemsService.getItemsByStore(storeId, query);
    }

    @ApiOperation({ summary: 'API get redeem items in store' })
    @UseGuards(UserGuard, StoreGuard)
    @ApiBearerAuth()
    @Get('/:storeId/redeem-items')
    @HttpCode(200)
    async getRedeemItemsInStore(
        @UuidParam('storeId') storeId: string,
        @Query() query: GetListDto,
    ) {
        return await this.redeemItemsService.getRedeemItemsByStore(storeId, query);
    }

    @ApiOperation({ summary: 'API get store by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
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
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Post()
    @HttpCode(201)
    async createStore(@Body() payload: CreateStoreDto) {
        return await this.storesService.createStore(payload);
    }

    @ApiOperation({ summary: 'API approve store' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/approve/:id')
    @HttpCode(201)
    async approveStore(@UuidParam('id') id: string) {
        return await this.storesService.approveStore(id);
    }

    @ApiOperation({ summary: 'API update store' })
    @ApiBody({
        type: UpdateStoreDto,
        required: true,
        description: 'Admin update store'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateStore(@UuidParam('id') id: string, @Body() payload: UpdateStoreDto) {
        return await this.storesService.updateStore(id, payload);
    }

    @ApiOperation({ summary: 'API delete store' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteStore(@UuidParam('id') id: string) {
        return await this.storesService.deleteStore(id);
    }

    @ApiOperation({ summary: 'API complete order' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Put('/complete-order/:orderId')
    @HttpCode(201)
    async completeOrder(@UuidParam('orderId') orderId: string, @Store() store: TStore) {
        return await this.storesService.completeOrder(orderId, store.id);
    }

    @ApiOperation({ summary: 'API login store' })
    @ApiBody({
        type: LoginDto,
        required: true,
        description: 'Login store'
    })
    @Post("/login")
    @HttpCode(201)
    async login(@Body() payload: LoginDto) {
        return await this.storesService.login(payload);
    }

    @ApiOperation({ summary: 'API register store' })
    @ApiBody({
        type: CreateStoreDto,
        required: true,
        description: 'Register store'
    })
    @Post("/register")
    @HttpCode(201)
    async register(@Body() payload: CreateStoreDto) {
        return await this.storesService.register(payload);
    }

    @ApiOperation({ summary: 'API send OTP' })
    @ApiBody({
        type: SendOTPDto,
        required: true,
        description: 'Send OTP',
    })
    @Post('/send-otp')
    @HttpCode(200)
    async sendOtp(@Body() payload: SendOTPDto) {
        const { email, hash } = payload;
        const result = await this.storesService.sendOTP(email, hash);
        return result;
    }

    @ApiOperation({ summary: 'API verify OTP' })
    @ApiBody({
        type: VerifyOTPDto,
        required: true,
        description: 'Verify OTP',
    })
    @Post('/verify-otp')
    @HttpCode(200)
    async verifyOtp(@Body() payload: VerifyOTPDto) {
        const { otp, hash } = payload;
        const result = await this.storesService.verifyOTP(otp, hash);
        return result;
    }
}
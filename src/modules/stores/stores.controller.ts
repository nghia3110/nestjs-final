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
    CreateStoreDto,
    UpdateStoreDto,
} from './dto';
import { LoginDto } from './dto/login.dto';
import { SendOTPDto, VerifyOTPDto } from './dto/otp.dto';
import { StoresService } from './stores.service';

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
        const paginateInfo = { page, limit } as GetListDto;
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
    @Put('/approve/:id')
    @HttpCode(201)
    async approveStore(@UuidParam('id') id: string) {
        return await this.storesService.approveStore(id);
    }

    @ApiOperation({ summary: 'API get store by Id' })
    @UseGuards(StoreGuard)
    @Get('/users')
    @HttpCode(200)
    async getUsersInStore(
        @Store() store: TStore,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const paginateInfo = { page, limit } as GetListDto;
        return await this.storesService.getAllUsersInStore(paginateInfo, store);
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
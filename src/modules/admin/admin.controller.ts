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
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { AdminGuard, UuidParam } from "src/utils";
import { GetListDto } from "src/database";
import { CreateUserDto, UpdateUserDto } from "../users";
import { CreateStoreDto, UpdateStoreDto } from "../stores";

@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) { }

    @ApiOperation({ summary: 'API get user by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/get-user/:id')
    @HttpCode(200)
    async getUserById(@UuidParam('id') id: string) {
        return await this.adminService.getUserById(id);
    }

    @ApiOperation({ summary: 'API get list users' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/get-users')
    @HttpCode(200)
    async getListUsers(
        @Query() query: GetListDto) {
        return await this.adminService.getListUsers(query);
    }

    @ApiOperation({ summary: 'API create user' })
    @ApiBody({
        type: CreateUserDto,
        required: true,
        description: 'Admin create user'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Post('/create-user')
    @HttpCode(201)
    async createUser(@Body() payload: CreateUserDto) {
        return await this.adminService.createUser(payload);
    }

    @ApiOperation({ summary: 'API update user' })
    @ApiBody({
        type: UpdateUserDto,
        required: true,
        description: 'Admin update user'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/update-user/:id')
    @HttpCode(201)
    async updateUser(@UuidParam('id') id: string, @Body() payload: UpdateUserDto) {
        return await this.adminService.updateUser(id, payload);
    }

    @ApiOperation({ summary: 'API delete user' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/delete-user/:id')
    @HttpCode(200)
    async deleteUser(@UuidParam('id') id: string) {
        await this.adminService.deleteUser(id);
    }

    @ApiOperation({ summary: 'API get store by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/get-store/:id')
    @HttpCode(200)
    async getStoreById(@UuidParam('id') id: string) {
        return await this.adminService.getStoreById(id);
    }

    @ApiOperation({ summary: 'API get list stores' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/get-stores')
    @HttpCode(200)
    async getListStores(
        @Query() query: GetListDto) {
        return await this.adminService.getListStores(query);
    }

    @ApiOperation({ summary: 'API create store' })
    @ApiBody({
        type: CreateStoreDto,
        required: true,
        description: 'Admin create store'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Post('/create-store')
    @HttpCode(201)
    async createStore(@Body() payload: CreateStoreDto) {
        return await this.adminService.createStore(payload);
    }

    @ApiOperation({ summary: 'API approve store' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/approve-store/:id')
    @HttpCode(201)
    async approveStore(@UuidParam('id') id: string) {
        return await this.adminService.approveStore(id);
    }

    @ApiOperation({ summary: 'API update store' })
    @ApiBody({
        type: UpdateStoreDto,
        required: true,
        description: 'Admin update store'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/update-store/:id')
    @HttpCode(201)
    async updateStore(@UuidParam('id') id: string, @Body() payload: UpdateStoreDto) {
        return await this.adminService.updateStore(id, payload);
    }

    @ApiOperation({ summary: 'API delete store' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('//delete-store/:id')
    @HttpCode(200)
    async deleteStore(@UuidParam('id') id: string) {
        return await this.adminService.deleteStore(id);
    }
}
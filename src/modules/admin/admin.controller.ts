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
import { GetListDto } from "src/database";
import { AdminGuard, UuidParam } from "src/utils";
import { CreateStoreDto, UpdateStoreDto } from "../stores";
import { CreateUserDto, UpdateUserDto } from "../users";
import { AdminService } from "./admin.service";
import { LoginAdminDto } from "./dto";

@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) { }

    @ApiOperation({ summary: 'API Login' })
    @ApiBody({
      type: LoginAdminDto,
      required: true,
      description: 'Login admin',
    })
    @Post('/login')
    @HttpCode(200)
    async login(@Body() payload: LoginAdminDto) {
      return this.adminService.login(payload);
    }

    @ApiOperation({ summary: 'API get user by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/users/:id')
    @HttpCode(200)
    async getUserById(@UuidParam('id') id: string) {
        return this.adminService.getUserById(id);
    }

    @ApiOperation({ summary: 'API get list users' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/users')
    @HttpCode(200)
    async getListUsers(
        @Query() query: GetListDto) {
        return this.adminService.getListUsers(query);
    }

    @ApiOperation({ summary: 'API create user' })
    @ApiBody({
        type: CreateUserDto,
        required: true,
        description: 'Admin create user'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Post('/users')
    @HttpCode(201)
    async createUser(@Body() payload: CreateUserDto) {
        return this.adminService.createUser(payload);
    }

    @ApiOperation({ summary: 'API update user' })
    @ApiBody({
        type: UpdateUserDto,
        required: true,
        description: 'Admin update user'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/users/:id')
    @HttpCode(201)
    async updateUser(@UuidParam('id') id: string, @Body() payload: UpdateUserDto) {
        return this.adminService.updateUser(id, payload);
    }

    @ApiOperation({ summary: 'API delete user' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/users/:id')
    @HttpCode(200)
    async deleteUser(@UuidParam('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    @ApiOperation({ summary: 'API get store by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/stores/:id')
    @HttpCode(200)
    async getStoreById(@UuidParam('id') id: string) {
        return this.adminService.getStoreById(id);
    }

    @ApiOperation({ summary: 'API get list stores' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/stores')
    @HttpCode(200)
    async getListStores(
        @Query() query: GetListDto) {
        return this.adminService.getListStores(query);
    }

    @ApiOperation({ summary: 'API create store' })
    @ApiBody({
        type: CreateStoreDto,
        required: true,
        description: 'Admin create store'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Post('/stores')
    @HttpCode(201)
    async createStore(@Body() payload: CreateStoreDto) {
        return this.adminService.createStore(payload);
    }

    @ApiOperation({ summary: 'API approve store' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/stores/:id/approve')
    @HttpCode(201)
    async approveStore(@UuidParam('id') id: string) {
        return this.adminService.approveStore(id);
    }

    @ApiOperation({ summary: 'API update store' })
    @ApiBody({
        type: UpdateStoreDto,
        required: true,
        description: 'Admin update store'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/stores/:id')
    @HttpCode(201)
    async updateStore(@UuidParam('id') id: string, @Body() payload: UpdateStoreDto) {
        return this.adminService.updateStore(id, payload);
    }

    @ApiOperation({ summary: 'API delete store' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/stores/:id')
    @HttpCode(200)
    async deleteStore(@UuidParam('id') id: string) {
        return this.adminService.deleteStore(id);
    }
}
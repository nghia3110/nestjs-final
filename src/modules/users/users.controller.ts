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

import { AdminGuard, UuidParam } from 'src/utils';
import {
  CreateUserDto,
  ForgetPasswordDto,
  LoginDto,
  SendOTPDto,
  UpdateUserDto,
  VerifyOTPDto
} from './dto';
import { UsersService } from './users.service';
import { GetListDto } from 'src/database';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @ApiOperation({ summary: 'API get list users' })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get()
  @HttpCode(200)
  async getListUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string) {
    const paginateInfo = { page, limit } as GetListDto;
    return await this.usersService.getListUsers(paginateInfo);
  }

  @ApiOperation({ summary: 'API get user by Id' })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('/:id')
  @HttpCode(200)
  async getUserById(@UuidParam('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'API create user' })
  @ApiBody({
    type: CreateUserDto,
    required: true,
    description: 'Admin create user'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  @HttpCode(201)
  async createUser(@Body() payload: CreateUserDto) {
    return await this.usersService.createUser(payload);
  }

  @ApiOperation({ summary: 'API update user' })
  @ApiBody({
    type: UpdateUserDto,
    required: true,
    description: 'Admin update user'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Put('/:id')
  @HttpCode(201)
  async updateUser(@UuidParam('id') id: string, @Body() payload: UpdateUserDto) {
    return await this.usersService.updateUser(id, payload);
  }

  @ApiOperation({ summary: 'API delete user' })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete('/:id')
  @HttpCode(200)
  async deleteUser(@UuidParam('id') id: string) {
    await this.usersService.deleteUser(id);
  }

  @ApiOperation({ summary: 'API Login' })
  @ApiBody({
    type: LoginDto,
    required: true,
    description: 'Login user',
  })
  @Post('/login')
  @HttpCode(200)
  async login(@Body() payload: LoginDto) {
    return this.usersService.login(payload);
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
    const result = await this.usersService.sendOTP(email, hash);
    return {
      hash: result,
    };
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
    const result = await this.usersService.verifyOTP(otp, hash);
    return {
      hash: result,
    };
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'API reset your password' })
  @ApiBody({
    type: ForgetPasswordDto,
    required: true,
    description: 'Forget password',
  })
  @Post('/forget-password')
  @HttpCode(200)
  async forgetPassword(@Body() payload: ForgetPasswordDto) {
    const { newPassword, hash } = payload;
    const result = await this.usersService.forgetPassword(newPassword, hash);
    return {
      status: result,
    };
  }
}

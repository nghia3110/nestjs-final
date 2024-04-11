import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetListDto } from 'src/database';
import { TUser } from 'src/types';
import { User, UserGuard, UuidParam } from 'src/utils';
import { RedeemItemsService } from '../redeem-items';
import { RedeemsService } from '../redeems';
import {
  CreateUserDto,
  LoginUserDto,
  SendUserOTPDto,
  VerifyUserOTPDto
} from './dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly redeemsService: RedeemsService,
    private readonly redeemItemsService: RedeemItemsService,
  ) { }

  @ApiOperation({ summary: 'API get redeem by user' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('/redeems')
  @HttpCode(200)
  async getRedeemsByUser(@Query() query: GetListDto, @User() user: TUser) {
    return await this.redeemsService.getRedeemsByUser(query, user.id);
  }

  @ApiOperation({ summary: 'API get redeem item in store' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('/get-redeem-item/store/:storeId')
  @HttpCode(200)
  async getRedeemItemsByStore(@Query() query: GetListDto, @UuidParam('storeId') storeId: string) {
    return await this.redeemItemsService.getRedeemItemsByStore(storeId, query);
  }

  @ApiOperation({ summary: 'API complete redeem' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Put('/complete-redeem/:redeemId')
  @HttpCode(201)
  async completeOrder(@UuidParam('redeemId') redeemId: string, @User() user: TUser) {
    return await this.usersService.completeRedeem(redeemId, user.id);
  }

  @ApiOperation({ summary: 'API Login' })
  @ApiBody({
    type: LoginUserDto,
    required: true,
    description: 'Login user',
  })
  @Post('/login')
  @HttpCode(200)
  async login(@Body() payload: LoginUserDto) {
    return this.usersService.login(payload);
  }

  @ApiOperation({ summary: 'API register user' })
  @ApiBody({
    type: CreateUserDto,
    required: true,
    description: 'Register user'
  })
  @Post("/register")
  @HttpCode(201)
  async register(@Body() payload: CreateUserDto) {
    return await this.usersService.register(payload);
  }

  @ApiOperation({ summary: 'API send OTP' })
  @ApiBody({
    type: SendUserOTPDto,
    required: true,
    description: 'Send OTP',
  })
  @Post('/send-otp')
  @HttpCode(200)
  async sendOtp(@Body() payload: SendUserOTPDto) {
    const { phoneNumber, hash } = payload;
    const result = await this.usersService.sendOTP(phoneNumber, hash);
    return result;
  }

  @ApiOperation({ summary: 'API verify OTP' })
  @ApiBody({
    type: VerifyUserOTPDto,
    required: true,
    description: 'Verify OTP',
  })
  @Post('/verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() payload: VerifyUserOTPDto) {
    const { otp, hash } = payload;
    const result = await this.usersService.verifyOTP(otp, hash);
    return result;
  }
}

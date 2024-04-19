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

  @ApiOperation({ summary: 'API get profile' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('/profile')
  @HttpCode(200)
  async getProfile(@User() user: TUser) {
    return this.usersService.getUserById(user.id);
  }

  @ApiOperation({ summary: 'API get redeem by user' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('/redeems')
  @HttpCode(200)
  async getRedeemsByUser(@Query() query: GetListDto, @User() user: TUser) {
    return this.redeemsService.getRedeemsByUser(query, user.id);
  }

  @ApiOperation({ summary: 'API get list redeem detail' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('/redeems/:id/redeem-details')
  @HttpCode(200)
  async getDetails(
    @Query() query: GetListDto,
    @UuidParam('id') redeemId: string,
    @User() user: TUser) {
    return this.redeemsService.getDetails(query, redeemId, user.id);
  }

  @ApiOperation({ summary: 'API get redeem item in store' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('/stores/:id/redeem-items')
  @HttpCode(200)
  async getRedeemItemsByStore(@Query() query: GetListDto, @UuidParam('id') storeId: string) {
    return this.redeemItemsService.getRedeemItemsByStore(storeId, query);
  }

  @ApiOperation({ summary: 'API complete redeem' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Put('/redeems/:id/complete')
  @HttpCode(201)
  async completeOrder(@UuidParam('id') redeemId: string, @User() user: TUser) {
    return this.usersService.completeRedeem(redeemId, user.id);
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
    return this.usersService.register(payload);
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
    const { phoneNumber } = payload;
    const result = await this.usersService.sendOTP(phoneNumber);
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

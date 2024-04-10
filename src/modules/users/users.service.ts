import { Inject, Injectable, forwardRef } from '@nestjs/common';
import moment from 'moment';

import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET_KEY,
  APPLICATION,
  EPromotePoint,
  ERank,
  OTP,
  OTP_TIME_EXPIRE,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET_KEY,
  USER,
} from 'src/constants';
import { IHashAuthData, IHashResponse, IMessageResponse, IPaginationRes, IToken, IVerifyOTPData, TVerifyOTPRes } from 'src/interfaces';
import {
  CommonHelper,
  EncryptHelper,
  ErrorHelper,
  TokenHelper,
} from 'src/utils/helpers';

import { Op } from 'sequelize';
import { GetListDto, Rank, User } from 'src/database';
import { OrdersService } from '../orders/orders.service';
import { RanksService } from '../ranks/ranks.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { UsersRepository } from './users.repository';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly ranksService: RanksService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly smsService: SmsService
  ) { }

  async getListUsers(paginateInfo: GetListDto): Promise<IPaginationRes<User>> {
    const { page, limit } = paginateInfo;
    return this.usersRepository.paginate(parseInt(page), parseInt(limit), {
      include: [{
        model: Rank,
        as: 'rank'
      }],
      attributes: { exclude: ['password', 'rankId'] },
      raw: false,
      nest: true
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id
      },
      include: [{
        model: Rank,
        as: 'rank',
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] },
      raw: false,
      nest: true
    });
    if (!user) {
      ErrorHelper.BadRequestException(USER.USER_NOT_FOUND);
    }
    return user;
  }

  async checkConflictInfo(email: string, phoneNumber: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: {
        [Op.or]: {
          phoneNumber: phoneNumber,
          email: email
        }
      }
    });

    if (user) {
      ErrorHelper.BadRequestException(USER.CONFLICT);
    }
  }

  async createUser(body: CreateUserDto): Promise<User> {
    await this.checkConflictInfo(body.email, body.phoneNumber);

    const rank = await this.ranksService.findByName(ERank.BRONZE);

    const hashPassword = await EncryptHelper.hash(body.password);

    return this.usersRepository.create(
      {
        ...body,
        password: hashPassword,
        isVerified: true,
        rankId: rank.id
      })
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<User[]> {
    const user = await this.getUserById(id);

    if ((body.email && body.email !== user.email)
      || (body.phoneNumber && body.phoneNumber !== user.phoneNumber)) {
      await this.checkConflictInfo(body.email, body.phoneNumber);
    }

    return this.usersRepository.update(body, { where: { id } });
  }

  async deleteUser(id: string): Promise<IMessageResponse> {
    await this.getUserById(id);

    const deleteResult = await this.usersRepository.delete({ where: { id } });
    if (deleteResult <= 0) {
      ErrorHelper.BadRequestException(USER.DELETE_FAILED);
    }
    return {
      message: USER.DELETE_SUCCESS
    }
  }

  async getUsersByStore(storeId: string, paginateInfo: GetListDto): Promise<IPaginationRes<User>> {
    const orders = await this.ordersService.getOrdersByStore(storeId);

    const userIds = orders.map(order => order.userId);

    const { page, limit } = paginateInfo;
    return this.usersRepository.paginate(parseInt(page), parseInt(limit), {
      where: {
        id: { [Op.in]: userIds }
      },
      include: [{
        model: Rank,
        as: 'rank',
        attributes: ['name']
      }],
      attributes: { exclude: ['password', 'rankId'] },
      raw: false,
      nest: true
    });
  }

  async checkPromoteRank(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    let newRank: string;
    if (user.totalPoints >= EPromotePoint.SILVER) {
      const silverRank = await this.ranksService.findByName(ERank.SILVER);
      newRank = silverRank.id;
    }
    if (user.totalPoints >= EPromotePoint.GOLD) {
      const goldRank = await this.ranksService.findByName(ERank.GOLD);
      newRank = goldRank.id;
    }
    await this.usersRepository.update({
      rankId: newRank
    }, { where: { id: userId } });
  }

  async login(body: LoginUserDto): Promise<IHashResponse> {
    const { password, phoneNumber } = body;

    const user = await this.usersRepository.findOne({
      where: {
        phoneNumber,
      },
    });

    if (!user) {
      ErrorHelper.BadRequestException(USER.USER_NOT_FOUND);
    }
    const isValidPassword = await EncryptHelper.compare(
      password,
      user.password,
    );
    if (!isValidPassword) {
      ErrorHelper.BadRequestException(USER.INVALID_PASSWORD);
    }

    const hashData: IHashAuthData = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      isLogin: true
    }

    const hashCode = CommonHelper.hashData(
      JSON.stringify(hashData)
    );

    return {
      hash: hashCode
    };
  }

  async register(body: CreateUserDto): Promise<IHashResponse> {
    await this.checkConflictInfo(body.email, body.phoneNumber);

    const hashPassword = await EncryptHelper.hash(body.password);

    const newUser = await this.usersRepository.create(
      {
        ...body,
        password: hashPassword
      });

    const hashData: IHashAuthData = {
      id: newUser.id,
      phoneNumber: newUser.phoneNumber,
      isAdmin: newUser.isAdmin,
      isLogin: false
    };

    const hashCode = CommonHelper.hashData(
      JSON.stringify(hashData)
    );

    return {
      hash: hashCode
    };
  }

  private generateToken(payload: object): IToken {
    const { token: accessToken, expires } = TokenHelper.generate(
      payload,
      ACCESS_TOKEN_SECRET_KEY,
      ACCESS_TOKEN_EXPIRE_TIME,
    );
    const { token: refreshToken } = TokenHelper.generate(
      payload,
      REFRESH_TOKEN_SECRET_KEY,
      REFRESH_TOKEN_EXPIRE_TIME,
    );

    return {
      accessToken,
      expires,
      refreshToken,
    };
  }

  async sendOTP(phoneNumber: string, hash: string): Promise<IHashResponse> {
    const checkHashInfo = CommonHelper.checkHashData(hash);
    if (!checkHashInfo) {
      ErrorHelper.BadRequestException(APPLICATION.VERIFY_FAIL);
    }

    const hashInfo = JSON.parse(checkHashInfo) as IHashAuthData;

    if (hashInfo.phoneNumber !== phoneNumber) {
      ErrorHelper.InternalServerErrorException(APPLICATION.HASH_IS_NOT_CORRECT);
    }

    const OTP = CommonHelper.generateOTP();

    await this.smsService.sendOtp({
      to: '+84' + phoneNumber.slice(1),
      otp: OTP
    });

    const verifyOTPData: IVerifyOTPData = {
      otp: OTP,
      time: moment().add(OTP_TIME_EXPIRE, 'second').valueOf(),
      data: hashInfo
    }

    const hashCode = CommonHelper.hashData(
      JSON.stringify(verifyOTPData),
    );
    return {
      hash: hashCode
    };
  }

  async verifyOTP(otp: string, hash: string): Promise<TVerifyOTPRes> {
    const checkHashInfo = CommonHelper.checkHashData(hash);
    if (!checkHashInfo) {
      ErrorHelper.BadRequestException(APPLICATION.VERIFY_FAIL);
    }

    const hashInfo = JSON.parse(checkHashInfo) as IVerifyOTPData;
    if (hashInfo.time < new Date().getTime()) {
      ErrorHelper.InternalServerErrorException(OTP.OTP_TIMEOUT);
    }

    if (otp !== hashInfo.otp) {
      ErrorHelper.InternalServerErrorException(OTP.OTP_INVALID);
    }

    if (hashInfo.data.isLogin) {
      const token = this.generateToken({
        id: hashInfo.data.id,
        isAdmin: hashInfo.data.isAdmin
      });

      return {
        token
      }
    } else {
      const user = await this.usersRepository.findOne({
        where: {
          phoneNumber: hashInfo.data.phoneNumber
        }
      });

      if (!user) {
        ErrorHelper.BadRequestException(USER.USER_NOT_FOUND);
      }

      await this.usersRepository.update({
        isVerified: true
      }, { where: { id: user.id } })
    }


    return {
      message: APPLICATION.VERIFY_OTP_SUCCESS
    };
  }
}
import { Injectable } from '@nestjs/common';
import moment from 'moment';

import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET_KEY,
  APPLICATION,
  EPromotePoint,
  ERank,
  EStatus,
  OTP,
  OTP_TIME_EXPIRE,
  REDEEM,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET_KEY,
  USER,
} from 'src/constants';
import {
  IHashAuthData,
  IHashResponse,
  IMessageResponse,
  IPaginationRes,
  IProcessRedeemRes,
  IToken,
  IVerifyOTPData,
  TVerifyOTPRes
} from 'src/interfaces';
import {
  CommonHelper,
  EncryptHelper,
  ErrorHelper,
  TokenHelper,
} from 'src/utils/helpers';

import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { GetListDto, Rank, User } from 'src/database';
import { RanksService } from '../ranks/ranks.service';
import {
  RedeemsService
} from '../redeems';
import { SmsService } from '../sms/sms.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly ranksService: RanksService,
    private readonly redeemsService: RedeemsService,
    private readonly smsService: SmsService,
    private sequelize: Sequelize,
  ) { }

  async getListUsers(paginateInfo: GetListDto): Promise<IPaginationRes<User>> {
    const { page, limit } = paginateInfo;
    return this.usersRepository.paginate(parseInt(page), parseInt(limit), {
      where: {
        isAdmin: {[Op.ne]: 'true'}
      },
      include: [{
        model: Rank,
        as: 'rank',
        attributes: ['name']
      }],
      attributes: { exclude: ['password', 'rankId'] },
      order: [['lastName', 'DESC']],
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

  async getUsersByIds(userIds: string[], paginateInfo: GetListDto): Promise<IPaginationRes<User>> {
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
      order: [['lastName', 'DESC']],
      raw: false,
      nest: true
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email }
    })
    if (!user) {
      ErrorHelper.BadRequestException(USER.USER_NOT_FOUND);
    }
    return user;
  }

  async checkConflictInfo(email: string = '', phoneNumber: string = ''): Promise<void> {
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

    const newUser = await this.usersRepository.create(
      {
        ...body,
        password: hashPassword,
        isVerified: true,
        rankId: rank.id
      })

    return this.usersRepository.findOne({
      where: { id: newUser.id },
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

  async updateUser(id: string, body: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if(user.isAdmin) {
      ErrorHelper.BadRequestException(USER.NOT_UPDATE_ADMIN);
    }

    if ((body.email && body.email !== user.email)
      || (body.phoneNumber && body.phoneNumber !== user.phoneNumber)) {
      await this.checkConflictInfo(body.email, body.phoneNumber);
    }

    await this.usersRepository.update(body, { where: { id } });
    return this.usersRepository.findOne({
      where: { id },
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

  async deleteUser(id: string): Promise<IMessageResponse> {
    const user = await this.getUserById(id);

    if(user.isAdmin) {
      ErrorHelper.BadRequestException(USER.NOT_DELETE_ADMIN);
    }

    const deleteResult = await this.usersRepository.delete({ where: { id } });
    if (deleteResult <= 0) {
      ErrorHelper.BadRequestException(USER.DELETE_FAILED);
    }
    return {
      message: USER.DELETE_SUCCESS
    }
  }

  async completeRedeem(redeemId: string, userId: string): Promise<IProcessRedeemRes> {
    const redeem = await this.redeemsService.getRedeemById(redeemId);

    if (redeem.userId !== userId) {
      ErrorHelper.BadRequestException(REDEEM.REDEEM_NOT_FOUND);
    }

    if (redeem.status === EStatus.SUCCESS) {
      ErrorHelper.BadRequestException(REDEEM.REDEEM_ALREADY_SUCCESS);
    }

    const user = await this.getUserById(redeem.userId);

    const transaction = await this.sequelize.transaction();
    try {
      const totalPoints = await this.redeemsService.calcRedeemPoints(redeemId);

      if (totalPoints > user.currentPoints) {
        ErrorHelper.BadRequestException(REDEEM.COMPLETE_REDEEM_FAILED(user.currentPoints, totalPoints));
      }

      await this.redeemsService.processRedeem(redeemId);

      await this.updateUser(user.id, {
        currentPoints: user.currentPoints - totalPoints
      });

      await transaction.commit();
      return {
        totalPoints,
        status: EStatus.SUCCESS
      }
    } catch (error) {
      await transaction.rollback();
      ErrorHelper.BadRequestException(error);
    }
  }

  async checkPromoteRank(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    let newRank: string;
    if (user.totalPoints >= EPromotePoint.GOLD) {
      const goldRank = await this.ranksService.findByName(ERank.GOLD);
      newRank = goldRank.id;
    } else {
      if (user.totalPoints >= EPromotePoint.SILVER) {
        const silverRank = await this.ranksService.findByName(ERank.SILVER);
        newRank = silverRank.id;
      } else {
        return;
      }
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

    if (!user.isVerified) {
      ErrorHelper.BadRequestException(USER.USER_NOT_VERIFIED);
    }

    const hashCodeSendOtp = await this.sendOTP(user.phoneNumber);

    return {
      hash: hashCodeSendOtp.hash
    };
  }

  async register(body: CreateUserDto): Promise<IHashResponse> {
    await this.checkConflictInfo(body.email, body.phoneNumber);

    const rank = await this.ranksService.findByName(ERank.BRONZE);

    const hashPassword = await EncryptHelper.hash(body.password);

    const newUser = await this.usersRepository.create(
      {
        ...body,
        password: hashPassword,
        rankId: rank.id
      });

    const hashCodeSendOtp = await this.sendOTP(newUser.phoneNumber, false)

    return {
      hash: hashCodeSendOtp.hash
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

  async sendOTP(phoneNumber: string, isLogin: boolean = true): Promise<IHashResponse> {
    const user = await this.usersRepository.findOne({
      where: {
        phoneNumber
      }
    });

    if(!user) {
      ErrorHelper.BadRequestException(USER.USER_NOT_FOUND);
    }

    const OTP = CommonHelper.generateOTP();

    await this.smsService.sendOtp({
      to: '+84' + phoneNumber.slice(1),
      otp: OTP
    });

    const userInfo: IHashAuthData = {
      id: user.id,
      isAdmin: user.isAdmin,
      isLogin,
      phoneNumber
    }

    const verifyOTPData: IVerifyOTPData = {
      otp: OTP,
      time: moment().add(OTP_TIME_EXPIRE, 'second').valueOf(),
      data: userInfo
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
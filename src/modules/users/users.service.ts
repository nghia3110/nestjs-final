import { Injectable } from '@nestjs/common';
import md5 from 'md5';
import moment from 'moment';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET_KEY,
  APPLICATION,
  ERank,
  HASH,
  OTP,
  OTP_TIME_EXPIRE,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET_KEY,
  SECRET_KEY_SEND_GMAIL,
  USER,
} from 'src/constants';
import {
  CommonHelper,
  EncryptHelper,
  ErrorHelper,
  SendEmailHelper,
  TokenHelper,
} from 'src/utils/helpers';
import { IPaginationRes, IToken } from 'src/interfaces';

import { LoginDto } from './dto/login.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto, GetListUserDto, UpdateUserDto } from './dto';
import { Rank, User } from 'src/database';
import { Op } from 'sequelize';
import { RanksService } from '../ranks/ranks.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly ranksService: RanksService) { }

  async getListUsers(paginateInfo: GetListUserDto): Promise<IPaginationRes<User>> {
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
    return await this.usersRepository.findOne({
      where: {
        id
      },
      include: [{
        model: Rank,
        as: 'rank'
      }],
      attributes: { exclude: ['password', 'rankId'] },
      raw: false,
      nest: true
    });
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        [Op.or]: {
          phoneNumber: body.phoneNumber,
          email: body.email
        }
      }
    });

    if (user) {
      ErrorHelper.ConflictException(USER.CONFLICT);
    }
    const rank = await this.ranksService.findByName(ERank.BRONZE);

    const hashPassword = await EncryptHelper.hash(body.password);

    return await this.usersRepository.create(
      {
        ...body,
        password: hashPassword,
        isVerified: true,
        rankId: rank.id
      })
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: {
        id
      }
    });

    if (!user) {
      ErrorHelper.BadRequestException(USER.USER_NOT_FOUND);
    }

    if ((body.email && body.email !== user.email)
      || (body.phoneNumber && body.phoneNumber !== user.phoneNumber)) {
      const findUser = await this.usersRepository.findOne({
        where: {
          [Op.or]: {
            email: body.email,
            phoneNumber: body.phoneNumber
          }
        }
      });
      if (findUser) {
        ErrorHelper.ConflictException(USER.CONFLICT);
      }
    }

    return await this.usersRepository.update(body, { where: { id } });
  }

  async deleteUser(id: string): Promise<number> {
    const user = await this.usersRepository.findOne({
      where: {
        id
      }
    });

    if (!user) {
      ErrorHelper.BadRequestException(USER.USER_NOT_FOUND);
    }

    return await this.usersRepository.delete({ where: { id } });
  }

  async login(body: LoginDto): Promise<object> {
    const { password, email } = body;

    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      ErrorHelper.BadRequestException(USER.USER_NOT_FOUND);
    }
    const isValidPassword = await EncryptHelper.compare(
      password,
      user.password,
    );
    if (!isValidPassword)
      ErrorHelper.BadRequestException(USER.INVALID_PASSWORD);

    const token = this.generateToken(
      {
        id: user.id,
        isAdmin: user.isAdmin
      }
    );
    delete user.password;
    return {
      ...token,
      user,
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

  async sendOTP(email: string, hash: string): Promise<string> {
    const checkHash = md5(
      email + SECRET_KEY_SEND_GMAIL + moment().format('DD/MM/YYYY'),
    );
    console.log('check-hash: ', checkHash);

    if (checkHash !== hash) {
      ErrorHelper.InternalServerErrorException(APPLICATION.HASH_IS_NOT_CORRECT);
    }

    const OTP = CommonHelper.generateOTP();
    console.log('OTP: ', OTP);
    SendEmailHelper.sendOTP({
      to: email,
      subject: 'Confirm OTP',
      OTP,
    });

    const hashCode = CommonHelper.hashData(
      JSON.stringify({
        otp: OTP,
        time: moment().add(OTP_TIME_EXPIRE, 'second').valueOf(),
        email,
        isVerified: false,
      }),
    );
    return hashCode;
  }

  async verifyOTP(otp: string, hash: string): Promise<string> {
    const checkHashInfo = CommonHelper.checkHashData(hash);
    if (!checkHashInfo) {
      ErrorHelper.BadRequestException(APPLICATION.VERIFY_FAIL);
    }

    const hashInfo = JSON.parse(checkHashInfo);
    if (hashInfo.time < new Date().getTime()) {
      ErrorHelper.InternalServerErrorException(OTP.OTP_TIMEOUT);
    }

    if (otp !== hashInfo.otp) {
      ErrorHelper.InternalServerErrorException(OTP.OTP_INVALID);
    }

    const hashCode = CommonHelper.hashData(
      JSON.stringify({
        time: moment().add(OTP_TIME_EXPIRE, 'second').valueOf(),
        email: hashInfo.email,
        isVerified: true,
      }),
    );

    return hashCode;
  }

  async forgetPassword(newPassword: string, hash: string): Promise<boolean> {
    const checkHashInfo = CommonHelper.checkHashData(hash);
    if (!checkHashInfo) {
      ErrorHelper.BadRequestException(APPLICATION.VERIFY_FAIL);
    }
    const hashInfo = JSON.parse(checkHashInfo);
    if (hashInfo.time < new Date().getTime()) {
      ErrorHelper.InternalServerErrorException(
        USER.EXPIRE_TIME_CHANGE_PASSWORD,
      );
    }
    if (!hashInfo.isVerified) {
      ErrorHelper.InternalServerErrorException(HASH.UNVERIFIED_HASH);
    }
    const userInfo = await this.usersRepository.findOne({
      where: {
        email: hashInfo.email,
      },
    });
    if (!userInfo)
      throw ErrorHelper.InternalServerErrorException(USER.USER_NOT_FOUND);

    const hashPassword = await EncryptHelper.hash(newPassword);
    await this.usersRepository.update(
      {
        password: hashPassword,
      },
      {
        where: {
          email: hashInfo.email,
        },
      },
    );

    return true;
  }
}

import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { TWILIO_PHONE_NUMBER } from 'src/constants';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class SmsService {
  constructor(
    private readonly twilioService: TwilioService
  ) {}

  async sendSms(to: string, content: string): Promise<MessageInstance>{
    return this.twilioService.client.messages.create({
      body: content,
      to,
      from: TWILIO_PHONE_NUMBER
    });
  }

  async sendOtp({to, otp}): Promise<MessageInstance> {
    const content = `Your OTP is ${otp}`;
    return await this.sendSms(to, content);
  }
}

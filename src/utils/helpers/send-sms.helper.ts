import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from 'src/constants';
import { Twilio } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

export class SendSmsHelper {
  private static async sendSms(to: string, content: string): Promise<MessageInstance> {
    const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const message = await twilioClient.messages.create({
      body: content,
      to,
      from: TWILIO_PHONE_NUMBER
    });

    return message;
  }

  static async sendOtp({to, otp}): Promise<MessageInstance> {
    const content = `Your OTP is ${otp}`;
    return await this.sendSms(to, content);
  }
}

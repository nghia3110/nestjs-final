import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from 'src/constants';
import { SmsService } from './sms.service';

@Module({
    imports: [
        TwilioModule.forRoot({
            accountSid: TWILIO_ACCOUNT_SID,
            authToken: TWILIO_AUTH_TOKEN,
          }),
    ],
    controllers: [],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule { }

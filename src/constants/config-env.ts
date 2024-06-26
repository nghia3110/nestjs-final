import * as dotenv from 'dotenv';
dotenv.config();

// const NEED_TO_CONFIGURED = 'NEED TO CONFIGURED';

// environment
export const ENVIRONMENT: string = process.env.ENVIRONMENT || 'local';

export const URL_PREFIX: string = process.env.URL_PREFIX || '/api';
export const SECRET_CRONJOB: string = process.env.SECRET_CRONJOB || '27dfa083-4675-4aae-88f5-194054da69f6';

//token
export const ACCESS_TOKEN_EXPIRE_TIME = process.env.ACCESS_TOKEN_EXPIRE_TIME || '30d';
export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY || '5239955f-4e01-4873-aca9-5183816ae4a9';
export const STORE_ACCESS_TOKEN_SECRET_KEY = process.env.STORE_ACCESS_TOKEN_SECRET_KEY || '50ffe3c5-aeb1-4b07-b0d1-d0adf0008b22';

//refresh-token
export const REFRESH_TOKEN_EXPIRE_TIME = process.env.REFRESH_TOKEN_EXPIRE_TIME || '90d';
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY || 'f23e4ace-dd6b-419f-8e29-2419504e14c5';

// application
export const SERVER_PORT: number = +process.env.SERVER_PORT || 3000;
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/';
export const SECRET_KEY_SEND_GMAIL = process.env.SECRET_KEY_SEND_GMAIL || '57ec1978-ddad-48b6-8db7-88123a8da5c2';
export const SECRET_KEY_SEND_SMS = process.env.SECRET_KEY_SEND_SMS || '';
export const OTP_TIME_EXPIRE = +process.env.OTP_TIME_EXPIRE || 300;

// Upload image service
export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || '';
export const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || '';
export const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || '';
export const DEFAULT_ITEM_IMAGE = process.env.DEFAULT_ITEM_IMAGE || '';

// Postgresql
export const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
export const POSTGRES_PORT = +process.env.POSTGRES_PORT || 5432;
export const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME || 'postgres';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password';
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'base';

// Redis
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = +process.env.REDIS_PORT || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
export const REDIS_DB = +process.env.REDIS_DB || 0;
export const PREFIX_KEY = process.env.PREFIX_KEY || '';

// Send-email
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'example@adamosoft.com';
export const ADMIN_PASSWORD_EMAIL = process.env.ADMIN_PASSWORD_EMAIL || 'abc+=123';
export const ADMIN_EMAIL_NAME = process.env.ADMIN_EMAIL_NAME || 'abc+=123';

// Send SMS
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

export const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET || '';
export const VONAGE_API_KEY = process.env.VONAGE_API_KEY || '';
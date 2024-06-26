export const APPLICATION = {
  CURRENT_PASS_NOT_MATCH: 'The current password is incorrect !',
  TOKEN_NULL: 'You must submit a request to change your password !',
  PASS_NOT_MATCH: 'Incorrect password. Please re-enter the information !',
  PASSWORD_NOT_MATCH: 'The repeat password and password must match',
  PHONE_EXIST: 'The phone number already exist. Please try again !',
  PHONE_NOT_EXIST: 'This phone number does not exist !',
  HASH_IS_NOT_CORRECT: 'Hash is not correct. Please try again',
  VERIFY_FAIL: 'Authentication failed. Please try again',
  VERIFY_OTP_SUCCESS: 'Verify OTP success!'
};

export const EMAIL = {
  EMAIL_EXIST: 'The email already exist. Please try again',
  EMAIL_NOT_EXIST: 'This email does not exist !',
  EMAIL_NOT_CHANGE: 'This is your current email, can not change',
  NOT_CONFIRM_CHANGE_EMAIL: 'Your email have requested change but does not verify, let check your email !',
};

export const OTP = {
  OTP_TIMEOUT: 'OTP has expired. Please try again',
  OTP_INVALID: 'Invalid OTP code. Please try again',
  WRONG_OTP_CODE: 'The otp code is incorrect, please enter the number !',
  OVERTIME_SCAN_OTP: 'OTP entries have been exceeded. Please try again after 10 minutes',
};

export const HASH = {
  UNVERIFIED_HASH: 'Hash is not verified. Please try again',
};

export const REQUIRED_VALIDATE = (field: string) => `The ${field} is required!`;
export const MAX_LENGTH_VALIDATE = (field: string, numChars: number) => `The ${field} is less than ${numChars} characters.`;
export const MIN_LENGTH_VALIDATE = (field: string, numChars: number) => `The ${field} is from ${numChars} characters or more.`;
export const POSITIVE_VALIDATE = (field: string) => `The ${field} must be greater than 0!`;
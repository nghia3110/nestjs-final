export interface ITokenPayload {
    id: string,
    isAdmin?: boolean,
    isStore?: boolean
}

export interface IHashAuthData {
    id: string;
    isAdmin: boolean;
    phoneNumber: string;
    isLogin: boolean;
}

export interface IVerifyOTPData {
    otp: string;
    time: number;
    data: IHashAuthData
}
import { Order } from "src/database";
import { IToken } from "./token.interfaces";

export interface IResponse {
  data?: any;
  success: boolean;
  code: number;
  message: string;
  errors?: string;
}

export interface IPaginationRes<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IMessageResponse {
  message: string;
}

export interface IHashResponse {
  hash: string;
}

export interface ILoginResponse<T> {
  token: IToken,
  item: T
}

export interface IVerifyOTPResponse {
  email?: string;
  phoneNumber?: string;
  isVerified: boolean;
}

export interface IOrderAmount {
  order: Order,
  totalAmount: number
}
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

export interface ILoginResponse {
  token: IToken,
}

export type TVerifyOTPRes = ILoginResponse | IMessageResponse;

export interface IOrderAmount {
  totalAmount: number
}
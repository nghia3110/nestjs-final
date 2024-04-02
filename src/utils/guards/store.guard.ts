import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_TOKEN_SECRET_KEY, AUTH, STORE_ACCESS_TOKEN_SECRET_KEY } from 'src/constants';
import { ITokenPayload } from 'src/interfaces';
import { ErrorHelper, TokenHelper } from 'src/utils';

@Injectable()
export class StoreGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const authorization = req.headers.authorization || String(req.cookies.JWT);
        const storeInfo = await this.verifyStore(authorization);
        req.store = storeInfo;

        return true;
    }

    async verifyStore(authorization: string) {
        const [bearer, accessToken] = authorization.split(' ');
        if (bearer === 'Bearer' && accessToken !== '') {
            const payload = TokenHelper.verify(accessToken, STORE_ACCESS_TOKEN_SECRET_KEY) as ITokenPayload;
            if (!payload.isStore) {
                ErrorHelper.BadRequestException(AUTH.NOT_STORE);
            }
            return payload;
        } else {
            ErrorHelper.UnauthorizedException(AUTH.UNAUTHORIZED);
        }
    }
}

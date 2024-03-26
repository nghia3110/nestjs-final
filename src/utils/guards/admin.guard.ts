import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_TOKEN_SECRET_KEY } from 'src/constants';
import { IPayload } from 'src/interfaces';
import { ErrorHelper, TokenHelper } from 'src/utils';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const authorization = req.headers.authorization || String(req.cookies.JWT);
        const userInfo = await this.verifyAdminRole(authorization);
        req.user = userInfo;

        return true;
    }

    async verifyAdminRole(authorization: string) {
        const [bearer, accessToken] = authorization.split(' ');
        if (bearer === 'Bearer' && accessToken !== '') {
            const payload = TokenHelper.verify(accessToken, ACCESS_TOKEN_SECRET_KEY) as IPayload;
            if (!payload.isAdmin) {
                ErrorHelper.BadRequestException("You're not admin!");
            }
            return payload;
        } else {
            console.log(authorization)
            ErrorHelper.UnauthorizedException('Unauthorized');
        }
    }
}

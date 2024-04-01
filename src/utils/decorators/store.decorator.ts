import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TStore } from 'src/types';

export const Store = createParamDecorator<any, any, TStore>(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const store = request.store;

    return data ? store?.[data] : store;
  },
);

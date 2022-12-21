import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from 'express';

export const GetUser = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { user } = request;
    
    if (!user) return null;
    if (data) return user[data];
    return user;

})
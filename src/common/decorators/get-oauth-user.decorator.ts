import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const UserFromOAuth = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        if (!data) return request.user;
        return request.user;
    }
);
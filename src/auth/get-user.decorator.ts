import { createParamDecorator } from "@nestjs/common/decorators/http/create-route-param-metadata.decorator"
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface"
import { User } from "./auth.entity";

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User =>{
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})
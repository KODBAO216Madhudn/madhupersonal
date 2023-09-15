import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./auth.entity";
import { Repository } from "typeorm";
import {PassportStrategy} from "@nestjs/passport";
import { JwtPayload } from "./jwt-payload.interface";
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
    ){
        super({
            secretOrKey : 'topSecret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User>{

        const {uname} = payload;

        const user=await this.userRepository.findOne({
            where:{
                uname,
            }
        })

        if(!user ){
            throw new UnauthorizedException('You dont have the permission');
        }
        return user;
    }
}
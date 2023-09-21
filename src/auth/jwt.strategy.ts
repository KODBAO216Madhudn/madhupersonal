import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./auth.entity";
import { Repository } from "typeorm";
import {PassportStrategy} from "@nestjs/passport";
import { JwtPayload } from "./jwt-payload.interface";
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
        private configService: ConfigService,
    ){
        super({
            secretOrKey : configService.get('JWT_SECRET'),
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
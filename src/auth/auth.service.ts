import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { promises } from 'dns';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './jwt-payload.interface';
// ------------------------------------------------------------------------

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private authRepository : Repository<User>,
        private jwtService : JwtService,
        ){}

        async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{

            const {uname, upass} = authCredentialsDto;

            const salt=await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(upass, salt);

            const user=await this.authRepository.create({uname,upass: hashedPassword});

            try{

                await this.authRepository.save(user);
            }catch(error){
                if(error.code === "23505"){
                    throw new ConflictException('Username is already exists');
                }else{
                    throw new InternalServerErrorException();
                }
            }
            
        }

        async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken:string}>{

            const {uname, upass} = authCredentialsDto;


            const user = await this.authRepository.findOne({where: {
                uname,
              },});
            if(user && (await bcrypt.compare(upass, user.upass))){

                const payload: JwtPayload = {uname};
                const accessToken: string = await this.jwtService.sign(payload);

                return {accessToken};
            }else{
                throw new UnauthorizedException('Please Check the credentials');
            }
            
        }

        async getAll(): Promise<User[]>{

                const found = this.authRepository.createQueryBuilder('task');
            const user=await found.getMany();

            return user;
        }
}

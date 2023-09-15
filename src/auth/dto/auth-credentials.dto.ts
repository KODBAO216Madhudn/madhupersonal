import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    uname: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,{message:"Pasword is too weak"})
    upass: string;
}
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken:string}> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get()
  getAll(): Promise<User[]> {
    return this.authService.getAll();
  }
}

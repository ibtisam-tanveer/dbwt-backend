import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/CreateUser.dto';
import { LoginUserDto } from '../users/dto/LoginUserDto';
// import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    console.log(body)
    return this.authService.signup(body);
  }



  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const user = await this.authService.validateUser(body);
    console.log(user)
    if (!user) {
      return { message: 'Invalid credentials' };
    }

    return { user, ... await this.authService.login(user) }
  }
}

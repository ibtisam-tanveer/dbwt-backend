import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/CreateUser.dto';
import { LoginUserDto } from '../users/dto/LoginUserDto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const { password } = createUserDto
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const newUser = await this.usersService.create({ ...createUserDto, password: hashedPassword });
      const { password: _, ...result } = newUser;
      return result;
    } catch (error) {
      console.log('server error', error.errorResponse)
      return { message: error.message, status: error.errorResponse.code }
    }
  }

}

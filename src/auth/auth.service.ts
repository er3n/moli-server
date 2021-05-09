import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { hash } from 'bcryptjs';
import { User } from 'src/users/users.schema';
import { password_salt } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateByEmail(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    if (!user.active) {
      return null;
    }

    const hashedPassword = await hash(password, password_salt);
    if (user.password === hashedPassword) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, gsm: user.gsm, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

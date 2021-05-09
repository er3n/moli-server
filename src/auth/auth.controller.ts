import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from './constants';
import { Auth } from './decorator/roles.decorator';
import { LocalAuthGuard } from './guards/local-auth-guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('admin-login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Auth(...Object.values(Role))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

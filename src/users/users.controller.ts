import { Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request<User>) {
    const createdUser = await this.usersService.create(req.body);
    return createdUser;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Req() req: Request<User>) {
    const createdUser = await this.usersService.create(req.body);
    return createdUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async query(): Promise<User[]> {
    const users = await this.usersService.query();
    return users;
  }
}

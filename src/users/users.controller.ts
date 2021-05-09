import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from 'src/shared/objectid-piipe';
import { CreateEmailUserDto, UpdateUserDto, UserDto } from './dto/user-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() req: CreateEmailUserDto) {
    const createdUser = await this.usersService.create(req);
    return createdUser;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id', ParseObjectIdPipe) id, @Body() req: UpdateUserDto) {
    const createdUser = await this.usersService.update(id, req);
    return createdUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async query(): Promise<UserDto[]> {
    const users = await this.usersService.query();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<UserDto> {
    const user = await this.usersService.delete(id);
    return user;
  }
}

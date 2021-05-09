import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from '../auth/constants';
import { Auth } from '../auth/decorator/roles.decorator';
import { ParseObjectIdPipe } from '../shared/pipes/objectid-pipe';
import { CreateEmailUserDto, UpdateUserDto, UserDto } from './dto/user-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() req: CreateEmailUserDto) {
    const createdUser = await this.usersService.create(req);
    return createdUser;
  }

  @Auth(Role.ADMIN)
  @Put(':id')
  async update(@Param('id', ParseObjectIdPipe) id, @Body() req: UpdateUserDto) {
    const createdUser = await this.usersService.update(id, req);
    return createdUser;
  }

  @Auth(Role.ADMIN)
  @Get()
  async query(): Promise<UserDto[]> {
    const users = await this.usersService.query();
    return users;
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<UserDto> {
    const user = await this.usersService.delete(id);
    return user;
  }
}

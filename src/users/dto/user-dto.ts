import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/constants';

export class CreateEmailUserDto {
  @IsEmail()
  email: string;

  @IsDefined()
  name: string;

  @MinLength(4)
  password: string;

  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  gsm?: string;

  @IsOptional()
  name?: string;

  @MinLength(4)
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  role?: Role;
}

export class UserDto {
  email?: string;
  gsm?: string;
  name?: string;
  role: Role;
  active: boolean;
  dateCreated: Date;
}

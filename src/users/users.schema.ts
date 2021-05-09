import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { IsEmail, IsNumber } from 'class-validator';
import { Document } from 'mongoose';
import { Role } from 'src/auth/constants';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  @IsEmail()
  email?: string;

  @Prop()
  gsm?: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  active: boolean;

  @Prop()
  dateCreated: Date;

  @Prop()
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { hash } from 'bcryptjs';
import { password_salt } from 'src/auth/constants';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel
      .findOne({
        email,
      })
      .exec();
    return user;
  }

  async query(): Promise<User[]> {
    const users = await this.userModel.find().sort({ dateCreated: -1 }).exec();
    return users;
  }

  async create(user: User): Promise<User> {
    const userWithSameEmail = await this.findByEmail(user.email);
    if (userWithSameEmail) {
      throw new ConflictException('Eposta adresi kullanılmaktadır.');
    }
    const password = await hash(user.password, password_salt);

    const userModel = new this.userModel({
      ...user,
      password,
      active: true,
      dateCreated: new Date(),
      deneme: '',
    } as User);
    return userModel.save();
  }
}

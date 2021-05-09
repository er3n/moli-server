import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { hash } from 'bcryptjs';
import { password_salt } from 'src/auth/constants';
import { CreateEmailUserDto, UpdateUserDto, UserDto } from './dto/user-dto';
import { use } from 'passport';

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

  async findByGsm(gsm: string): Promise<User | undefined> {
    const user = await this.userModel
      .findOne({
        gsm,
      })
      .exec();
    return user;
  }

  async query(): Promise<User[]> {
    const users = await this.userModel.find().sort({ dateCreated: -1 }).exec();
    return users;
  }

  async create(user: CreateEmailUserDto): Promise<UserDto> {
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
    } as User);
    return userModel.save();
  }

  async update(id: string, user: UpdateUserDto): Promise<UserDto> {
    const existUser = await this.userModel.findById(id).exec();

    if (!existUser) {
      throw new NotFoundException('Güncellenmek istenen kullanici bulunamadi.');
    }

    if (user.email && user.email !== existUser.email) {
      const userWithSameEmail = await this.findByEmail(user.email);
      if (userWithSameEmail) {
        throw new ConflictException(
          'Eposta adresi baska bir kullanici tarafindan kullanılmaktadır.',
        );
      }
    }
    if (user.gsm && user.gsm !== existUser.gsm) {
      const userWithSameSms = await this.findByGsm(user.gsm);
      if (userWithSameSms) {
        throw new ConflictException(
          'Sms numarasi baska bir kullanici tarafindan kullanılmaktadır.',
        );
      }
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        $set: {
          ...user,
        },
      },
    );

    return await this.userModel.findById(id).exec();
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findOneAndDelete({ _id: id });
    if (!deletedUser) {
      throw new NotFoundException('Kullanici bulunamadi');
    }
    return deletedUser;
  }
}

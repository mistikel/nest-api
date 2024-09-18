import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './schema/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async register(userDto: UserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const createdUser = new this.userModel({
      ...userDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }
}

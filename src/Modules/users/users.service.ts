import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    // async findByEmail(email: string): Promise<User | undefined> {
    //     return this.userModel.findOne({ email }).exec();
    // }

    async findByEmail(email: string): Promise<User | any> {
        return this.userModel.findOne({ email }).exec()
    }

    async create(userData: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(userData);
        return createdUser.save();
    }
}

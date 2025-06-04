import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    // async findByEmail(email: string): Promise<User | undefined> {
    //     return this.userModel.findOne({ email }).exec();
    // }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(userData: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(userData);
        return createdUser.save();
    }

    async addFavorite(userId: string, locationId: string): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: new Types.ObjectId(locationId) } },
            { new: true }
        ).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async removeFavorite(userId: string, locationId: string): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { favorites: new Types.ObjectId(locationId) } },
            { new: true }
        ).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async getFavorites(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId)
        // console.log(user?.favorites)
            .populate('favorites')
             .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}

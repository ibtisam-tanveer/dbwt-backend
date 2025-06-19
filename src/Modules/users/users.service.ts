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

    async toggleFavorite(userId: string, locationId: string): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        const locationObjectId = new Types.ObjectId(locationId);
        const isFavorite = user.favorites.some((favId) =>
          favId.equals(locationObjectId)
        );
      
        const update = isFavorite
          ? { $pull: { favorites: locationObjectId } }
          : { $addToSet: { favorites: locationObjectId } };
      
        const updatedUser = await this.userModel.findByIdAndUpdate(
          userId,
          update,
          { new: true }
        ).exec();
      
        if (!updatedUser) {
          throw new NotFoundException('User not found during update');
        }
      
        return updatedUser;
      }
      


    async getFavorites(userId: string): Promise<any[]> {
        const user = await this.userModel.findById(userId)
            .populate('favorites')
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.favorites;
    }

    // async getFavorites(userId: string): Promise<User> {
    //     const user = await this.userModel.findById(userId)
    //         // console.log(user?.favorites)
    //         .populate('favorites')
    //         .exec();

    //     if (!user) {
    //         throw new NotFoundException('User not found');
    //     }
    //     const fav = user.favorites

    //     return fav;
    // }
}

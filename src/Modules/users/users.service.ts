import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UpdateCurrentLocationDto } from './dto/UpdateCurrentLocationDto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    // async findByEmail(email: string): Promise<User | undefined> {
    //     return this.userModel.findOne({ email }).exec();
    // }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByUserId(userId: string): Promise<User | null> {
        return this.userModel.findById(userId).exec();
    }

    async create(userData: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(userData);
        return createdUser.save();
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if email is being updated and if it's already taken by another user
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser) {
                throw new ConflictException('Email already exists');
            }
        }

        // Hash password if it's being updated
        if (updateUserDto.password) {
            if (!updateUserDto.currentPassword) {
                throw new ConflictException('Current password is required to change password');
            }
            const isMatch = await bcrypt.compare(updateUserDto.currentPassword, user.password);
            if (!isMatch) {
                throw new ConflictException('Current password is incorrect');
            }
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            updateUserDto,
            { new: true }
        ).exec();

        if (!updatedUser) {
            throw new NotFoundException('User not found during update');
        }

        return updatedUser;
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
            .populate('favorites', 'type geometry properties address')
            .lean()
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Convert ObjectId buffers to strings
        const favorites = user.favorites || [];
        return favorites.map(favorite => ({
            ...favorite,
            _id: favorite._id.toString()
        }));
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

    async updateCurrentLocation(userId: string, locationData: UpdateCurrentLocationDto): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { 
                currentLocation: {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    updatedAt: new Date()
                }
            },
            { new: true }
        ).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async getCurrentLocation(userId: string): Promise<{ latitude: number; longitude: number; updatedAt: Date } | null> {
        const user = await this.userModel.findById(userId).exec();
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.currentLocation || null;
    }

    async findNearbyUsers(userId: string, distance: number = 1000): Promise<any[]> {
        const currentUser = await this.userModel.findById(userId).exec();
        
        if (!currentUser) {
            throw new NotFoundException('User not found');
        }

        if (!currentUser.currentLocation) {
            throw new NotFoundException('User location not found');
        }

        // At this point, we know currentLocation exists, so we can safely access it
        const currentLocation = currentUser.currentLocation;

        // Find users with role 'user' who have a current location within the specified distance
        const nearbyUsers = await this.userModel.find({
            _id: { $ne: userId }, // Exclude current user
            role: 'user',
            currentLocation: { $exists: true, $ne: null }
        }).lean().exec();

        console.log(`Found ${nearbyUsers.length} users with current locations (excluding current user)`);

        // Filter users within the specified distance
        const usersWithinDistance = nearbyUsers.filter(user => {
            if (!user.currentLocation) return false;
            
            const distanceInMeters = this.calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                user.currentLocation.latitude,
                user.currentLocation.longitude
            );
            
            console.log(`User ${user.fullName} is ${distanceInMeters.toFixed(0)}m away`);
            return distanceInMeters <= distance;
        });

        console.log(`Found ${usersWithinDistance.length} users within ${distance}m radius`);
        return usersWithinDistance;
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }
}

import { Controller, Post, Delete, Get, Put, Body, UseGuards, Request, HttpCode, Query, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ManageFavoriteDto } from './dto/ManageFavoriteDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UpdateCurrentLocationDto } from './dto/UpdateCurrentLocationDto';
import { UserResponseDto } from './dto/UserResponseDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getUserProfile(@Request() req): Promise<UserResponseDto> {
        const user = await this.usersService.findByUserId(req.user.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user as UserResponseDto;
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    @HttpCode(200)
    async updateUserProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.usersService.updateUser(req.user.userId, updateUserDto);
        return user as UserResponseDto;
    }

    @UseGuards(JwtAuthGuard)
    @Post('favorites')
    @HttpCode(200)
    async addFavorite(@Request() req, @Body() manageFavoriteDto: ManageFavoriteDto) {
        return this.usersService.addFavorite(req.user.userId, manageFavoriteDto.locationId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('toggle/favorites')
    @HttpCode(200)
    async toggleFavourites(@Request() req, @Body() manageFavoriteDto: ManageFavoriteDto) {
        return this.usersService.toggleFavorite(req.user.userId, manageFavoriteDto.locationId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('favorites')
    @HttpCode(200)
    async removeFavorite(@Request() req, @Body() manageFavoriteDto: ManageFavoriteDto) {
        return this.usersService.removeFavorite(req.user.userId, manageFavoriteDto.locationId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('favorites')
    async getFavorites(@Request() req) {
        const favorites = await this.usersService.getFavorites(req.user.userId);
        return favorites;
    }

    @UseGuards(JwtAuthGuard)
    @Put('current-location')
    @HttpCode(200)
    async updateCurrentLocation(@Request() req, @Body() updateLocationDto: UpdateCurrentLocationDto) {
        return this.usersService.updateCurrentLocation(req.user.userId, updateLocationDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('current-location')
    async getCurrentLocation(@Request() req) {
        return this.usersService.getCurrentLocation(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('nearby')
    async getNearbyUsers(@Request() req, @Query('distance') distance?: string) {
        const distanceInMeters = distance ? parseInt(distance) : 1000; // Default 1km
        const nearbyUsers = await this.usersService.findNearbyUsers(req.user.userId, distanceInMeters);
        
        // Return only necessary user information (exclude sensitive data)
        return nearbyUsers.map((user: any) => ({
            _id: user._id.toString(),
            fullName: user.fullName,
            currentLocation: user.currentLocation
        }));
    }
}

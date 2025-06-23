import { Controller, Post, Delete, Get, Put, Body, UseGuards, Request, HttpCode, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { ManageFavoriteDto } from './dto/ManageFavoriteDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UserResponseDto } from './dto/UserResponseDto';
import { LocationDto } from './dto/LocationDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { plainToClass } from 'class-transformer';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getUserProfile(@Request() req): Promise<UserResponseDto> {
        const user = await this.usersService.findByUserId(req.user.userId);
        return plainToClass(UserResponseDto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    @HttpCode(200)
    async updateUserProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.usersService.updateUser(req.user.userId, updateUserDto);
        return plainToClass(UserResponseDto, user);
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
        return favorites.map(favorite => plainToClass(LocationDto, favorite));
    }
}

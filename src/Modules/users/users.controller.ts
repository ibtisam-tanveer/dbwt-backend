import { Controller, Post, Delete, Get, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { ManageFavoriteDto } from './dto/ManageFavoriteDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Post('favorites')
    @HttpCode(200)
    async addFavorite(@Request() req, @Body() manageFavoriteDto: ManageFavoriteDto) {
        return this.usersService.addFavorite(req.user.userId, manageFavoriteDto.locationId);
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
        return this.usersService.getFavorites(req.user.userId);
    }
}

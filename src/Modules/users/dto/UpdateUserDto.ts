import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsStrongPassword()
    password?: string;

    @IsOptional()
    @IsString()
    currentPassword?: string;
} 
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsIn } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;
    
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsIn(['admin', 'user'])
    @IsString()
    role: 'admin' | 'user';
}

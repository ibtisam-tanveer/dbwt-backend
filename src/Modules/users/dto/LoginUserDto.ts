import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsIn } from 'class-validator';

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}

import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    _id: string;

    @Expose()
    email: string;

    @Expose()
    fullName: string;

    @Expose()
    role: string;

    @Expose()
    favorites: any[];

    @Exclude()
    password: string;
} 
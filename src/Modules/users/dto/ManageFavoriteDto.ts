import { IsNotEmpty, IsString } from 'class-validator';

export class ManageFavoriteDto {
    @IsNotEmpty()
    @IsString()
    locationId: string;
} 
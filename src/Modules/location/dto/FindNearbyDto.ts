import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindNearbyDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(10000) // Max 10km radius
  @IsOptional()
  distance: number = 1000; // Default 1km in meters
} 
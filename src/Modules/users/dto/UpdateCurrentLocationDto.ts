import { IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCurrentLocationDto {
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
} 
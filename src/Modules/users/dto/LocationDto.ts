import { Expose } from 'class-transformer';

export class LocationDto {
    @Expose()
    _id: string;

    @Expose()
    type: string;

    @Expose()
    geometry: any;

    @Expose()
    properties: Record<string, any>;

    @Expose()
    address: any;
} 
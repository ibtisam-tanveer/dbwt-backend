// src/location/schemas/location.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type LocationDocument = Location & Document;

@Schema({ _id: false })
class Geometry {
  @Prop({ required: true, enum: ['Point', 'Polygon', 'MultiPolygon', 'LineString'] })
  type: string;

  @Prop({ type: [Object], required: true })
  coordinates: any;
}

@Schema({ _id: false })
class Address {
  @Prop()
  country: string;

  @Prop()
  housenumber: string;

  @Prop()
  postcode: string;

  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  suburb?: string;

  @Prop()
  housename?: string;
}

@Schema()
export class Location extends Document {
  @Prop({ required: true, enum: ['Feature'] })
  type: string;

  @Prop({ type: Object, required: true })
  geometry: Geometry;

  @Prop({ type: Object, required: true })
  properties: Record<string, any>;

  @Prop({ type: Address })
  address: Address;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Add geospatial index for efficient nearby location queries
LocationSchema.index({ 'geometry.coordinates': '2dsphere' });

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

@Schema()
export class Location extends Document {
  @Prop({ required: true, enum: ['Feature'] })
  type: string;

  @Prop({ type: Object, required: true })
  geometry: Geometry;

  @Prop({ type: Object, required: true })
  properties: Record<string, any>;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

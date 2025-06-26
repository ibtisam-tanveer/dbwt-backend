import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
class CurrentLocation {
  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string; // e.g. 'user' or 'admin'

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Location' }], default: [] })
  favorites: Types.ObjectId[];

  @Prop({ type: CurrentLocation })
  currentLocation?: CurrentLocation;
}

export const UserSchema = SchemaFactory.createForClass(User);

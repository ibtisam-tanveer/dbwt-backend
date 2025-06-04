import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true})
  fullName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string; // e.g. 'user' or 'admin'

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Location' }], default: [] })
  favorites: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

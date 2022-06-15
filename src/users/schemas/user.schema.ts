import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type UserDocument = User & Document


@Schema()
export class User {

  @Prop({ type: mongooseSchema.Types.ObjectId})
  id: string;


  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true})
  password: string;

  @Prop({ required: true, unique: true})
  email: string;

  @Prop()
  isActive: boolean;

  @Prop()
  phone: string;

  @Prop({ required: true})
  displayName: string;

  @Prop({type: [String], default: ['user']})
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User)
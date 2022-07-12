import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type UserDocument = User & Document


@Schema({timestamps: true})
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
  username: string;

  @Prop({type: [String], default: ['user']})
  roles: string[];

  @Prop()
  displayPic: string;
}

export const UserSchema = SchemaFactory.createForClass(User)
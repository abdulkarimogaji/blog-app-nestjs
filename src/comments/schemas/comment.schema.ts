import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';


export type CommentDocument = Comment & Document



@Schema({ timestamps: true })
export class Comment {

  @Prop({ type: mongooseSchema.Types.ObjectId })
  id: string;


  @Prop({ required: true, type: mongooseSchema.Types.ObjectId, ref: "User"  })
  author: any

  @Prop({ required: true, type: mongooseSchema.Types.ObjectId, ref:"Blog"  })
  blog: any

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  isAnonymous: boolean;


  @Prop({ required: true, default: false })
  isHidden: boolean;

  @Prop({ default: 0})
  like_count: number


}

export const CommentSchema = SchemaFactory.createForClass(Comment)
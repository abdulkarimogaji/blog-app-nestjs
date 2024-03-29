import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document, Schema as mongooseSchema } from "mongoose";
import slugify from "slugify";

export type BlogDocument = Blog & Document;

@Schema({ _id: false })
class BlogSection extends Document {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  image: string;
}

const BlogSectionSchema = SchemaFactory.createForClass(BlogSection);

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: mongooseSchema.Types.ObjectId })
  id: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ required: true, type: mongooseSchema.Types.ObjectId, ref: "User" })
  author: any;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  isAnonymous: boolean;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [BlogSectionSchema], default: [] })
  sections: BlogSection;

  @Prop({ type: BlogSectionSchema })
  intro: BlogSection;

  @Prop({ default: 0 })
  like_count: number;

  @Prop({ default: 0 })
  view_count: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog)
  .index({
    title: "text",
    "intro.title": "text",
    "sections.title": "text",
    tags: "text",
  })
  .pre("save", async function (next) {
    const newBlog: any = this;
    newBlog.slug = slugify(newBlog.title.toLowerCase());
    next();
  });

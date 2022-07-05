import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/blogs/schemas/blog.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}, {name: Blog.name, schema: BlogSchema}]), JwtModule],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}

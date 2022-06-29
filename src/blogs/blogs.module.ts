import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]), JwtModule],
  providers: [BlogsService],
  controllers: [BlogsController]
})
export class BlogsModule {}

import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog, BlogDocument } from './schemas/blog.schema';



const lookupAuthor = [{
  $lookup: {
    from: 'users',
    localField: 'author',
    foreignField: '_id',
    as: 'author'
  }
}, {
  $unwind: {
    path: '$author',
    includeArrayIndex: 'string',
    preserveNullAndEmptyArrays: true
  }
}, {
  $project: {
    'author.password': 0,
    'author.roles': 0,
    'author.__v': 0
  }
}]
@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name)
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }


  async createBlog(blog: CreateBlogDto, author: string) {
    blog.author = author
    try {
      const newBlog = await (await this.blogModel.create(blog)).populate("author")
      return { message: "blog created successfully", data: newBlog }
    } catch (error) {
      this.logger.error(error)
      throw new HttpException(error, 500)
    }
  }


  async getBlogs() {
    try {
      const blogs = await this.blogModel.aggregate([...lookupAuthor])

      return { message: "blogs fetched successfully", data: blogs }
    } catch (error) {
      this.logger.error(error)
      throw new HttpException(error, 500)
    }
  }


  async getBlogById(id: string) {
    try {
      const blog = await this.blogModel.aggregate([{ $match: { $expr: { $eq: ["$_id", { $toObjectId: id }] } } }, ...lookupAuthor])
      if (blog[0] == undefined) throw new NotFoundException
      return { message: "blog fetched successfully", data: blog[0] }
    } catch (error) {
      this.logger.error(error)
      throw new HttpException(error, 500)
    }
  }

  async getUserBlogs(userId: string) {
    try {
      const blogs = await this.blogModel.find({ author: userId }).sort({ createdAt: -1, view_count: -1 })
      return { message: "blogs fetched successfully", data: blogs }
    } catch (error) {
      this.logger.error(error)
      throw new HttpException(error, 500)
    }
  }

  async viewBlog(blogId: string) {
    try {
      const r = await this.blogModel.updateOne({ _id: blogId }, { $inc: { view_count: 1 } })
      if (r.matchedCount === 0) {
        throw new NotFoundException
      }
      if (r.modifiedCount === 0) {
        throw new HttpException("view failed", 500)
      }
      return { message: "blog viewed successfully" }
    } catch (error) {
      this.logger.error(error)
      throw new HttpException(error, 500)
    }
  }
  async likeBlog(blogId: string) {
    try {
      const r = await this.blogModel.updateOne({ _id: blogId }, { $inc: { like_count: 1 } })
      if (r.matchedCount === 0) {
        throw new NotFoundException
      }
      if (r.modifiedCount === 0) {
        throw new HttpException("like failed", 500)
      }
      return { message: "blog liked successfully" }
    } catch (error) {
      this.logger.error(error)
      throw new HttpException(error, 500)
    }
  }

}

import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Blog, BlogDocument } from 'src/blogs/schemas/blog.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name)
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>, @InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }


  async createComment(comment: CreateCommentDto, author: string) {
    comment.author = author
    // check if blog exists first
    try {
      const blog = await this.blogModel.findById(comment.blog)
      if (!blog) throw new NotFoundException()
    } catch (error) {
      if (error instanceof NotFoundException) throw error
    }
    try {
      const newComment = await (await this.commentModel.create(comment)).populate({ path: "author", select: { password: 0 } })
      return { message: "comment created successfully", data: newComment }
    } catch (error) {
      this.logger.error(error)
      throw new HttpException(error, 500)
    }
  }

  async deleteComment(id: string, roles: string[], userId: string) {
    // only allow admin, author and blog owner to delete comments
    try {
      const comment = await this.commentModel.findById(id).populate({path: "blog", select: {author: 1}})
      if (!comment) throw new NotFoundException()
      if (roles.includes("admin") || comment.author == userId || comment.blog.author == userId) {
          await this.commentModel.deleteOne({ _id: id })
          return { message: "comment deleted successfully" }
      }
    } catch (error) {
      this.logger.error(error)
      if (error instanceof NotFoundException) throw new NotFoundException
      return new HttpException("Error", 500)
    }
  }
}

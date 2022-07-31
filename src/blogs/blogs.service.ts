import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { FetchQueryDto } from "./dto/fetch-query-dto";
import { Blog, BlogDocument } from "./schemas/blog.schema";

const commentSort: Record<string, 1 | -1 | any> = { createdAt: -1 };
const lookupAuthorAndComments = [
  {
    $lookup: {
      from: "comments",
      let: {
        blogId: "$_id",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$blog", "$$blogId"],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
          },
        },
        {
          $sort: commentSort,
        },
      ],
      as: "comments",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "author",
    },
  },
  {
    $unwind: {
      path: "$author",
    },
  },
  {
    $project: {
      "author.password": 0,
      "author.roles": 0,
      "comments.author.password": 0,
      "comments.author.roles": 0,
      "comments.author.createdAt": 0,
      "comments.author.updatedAt": 0,
      "comments.author.firstName": 0,
      "comments.author.lastName": 0,
      "comments.author.email": 0,
      "comments.author.phone": 0,
    },
  },
];
@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlog(blog: CreateBlogDto, author: string) {
    blog.author = author;
    try {
      const newBlog: any = await (
        await this.blogModel.create(blog)
      ).populate({ path: "author", select: { password: 0 } });
      return { message: "blog created successfully", data: newBlog };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async getBlogs(query: FetchQueryDto) {
    const matchStage = query.tag
      ? { $match: { tags: query.tag } }
      : { $match: {} };
    const limitStage = { $limit: query.limit || 1000 };
    const sort: Record<string, 1 | -1 | any> = {
      like_count: -1,
      view_count: -1,
      createdAt: -1,
    };
    const sortStage = { $sort: sort };
    const skipStage = { $skip: (query.page - 1) * query.limit || 0 };
    try {
      const blogs = await this.blogModel.aggregate([
        matchStage,
        sortStage,
        skipStage,
        limitStage,
        ...lookupAuthorAndComments,
      ]);

      return { message: "blogs fetched successfully", data: blogs };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async getBlogById(id: string) {
    try {
      const blog = await this.blogModel.aggregate([
        { $match: { $expr: { $eq: ["$_id", { $toObjectId: id }] } } },
        ...lookupAuthorAndComments,
      ]);
      if (blog[0] == undefined) {
        throw new NotFoundException();
      }
      return { message: "blog fetched successfully", data: blog[0] };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async getUserBlogs(userId: string) {
    try {
      const blogs = await this.blogModel.aggregate([
        { $match: { $expr: { $eq: ["$author", { $toObjectId: userId }] } } },
        ...lookupAuthorAndComments,
      ]);
      return { message: "blogs fetched successfully", data: blogs };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async viewBlog(blogId: string) {
    try {
      const r = await this.blogModel.updateOne(
        { _id: blogId },
        { $inc: { view_count: 1 } }
      );
      if (r.matchedCount === 0) {
        throw new NotFoundException();
      }
      if (r.modifiedCount === 0) {
        throw new HttpException("view failed", 500);
      }
      return { message: "blog viewed successfully" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error("logrus", error);
      throw new HttpException(error, 500);
    }
  }
  async likeBlog(blogId: string) {
    try {
      const r = await this.blogModel.updateOne(
        { _id: blogId },
        { $inc: { like_count: 1 } }
      );
      if (r.matchedCount === 0) {
        throw new NotFoundException();
      }
      if (r.modifiedCount === 0) {
        throw new HttpException("like failed", 500);
      }
      return { message: "blog liked successfully" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async searchBlogs(query: FetchQueryDto) {
    var matchStage = { $match: {} };
    var sort: Record<string, 1 | -1 | any> = {
      like_count: -1,
      view_count: -1,
      createdAt: -1,
    };
    if (query.searchKey && query.tag) {
      matchStage = {
        $match: {
          tags: { $elemMatch: { $eq: query.tag } },
          $text: { $search: `"${query.searchKey}"` },
        },
      };
      sort = {
        score: { $meta: "textScore" },
        like_count: -1,
        view_count: -1,
        createdAt: -1,
      };
    } else if (query.searchKey) {
      sort = {
        score: { $meta: "textScore" },
        like_count: -1,
        view_count: -1,
        createdAt: -1,
      };
      matchStage = { $match: { $text: { $search: `"${query.searchKey}"` } } };
    } else if (query.tag) {
      matchStage = { $match: { tags: { $elemMatch: { $eq: query.tag } } } };
    }

    const limitStage = { $limit: query.limit || 1000 };
    const sortStage = { $sort: sort };
    const skipStage = { $skip: (query.page - 1) * query.limit || 0 };
    try {
      const blogs = await this.blogModel.aggregate([
        matchStage,
        sortStage,
        skipStage,
        limitStage,
        ...lookupAuthorAndComments,
      ]);

      return { message: "blogs fetched successfully", data: blogs };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async getBlogBySlug(slug: string) {
    try {
      const blog = await this.blogModel.aggregate([
        { $match: { $expr: { $eq: ["$slug", slug] } } },
        ...lookupAuthorAndComments,
      ]);
      if (blog[0] == undefined) {
        throw new NotFoundException();
      }
      return { message: "blog fetched successfully", data: blog[0] };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }
}

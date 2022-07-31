import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { FetchQueryDto } from "./dto/fetch-query-dto";

@Controller("blogs")
export class BlogsController {
  constructor(private blogService: BlogsService) {}
  @Get()
  async getBlogs(@Query() query: FetchQueryDto) {
    return this.blogService.getBlogs(query);
  }

  @Get("/search")
  async searchBlogs(@Query() query: FetchQueryDto) {
    return this.blogService.searchBlogs(query);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async createBlog(@Body() body: CreateBlogDto, @Req() req) {
    return this.blogService.createBlog(body, req.user.userId as string);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async getMyBlogs(@Req() req: any) {
    return this.blogService.getUserBlogs(req.user.userId as string);
  }

  @Get(":slug")
  async getBlogById(@Param("slug") slug: string) {
    return this.blogService.getBlogBySlug(slug);
  }

  @Get("user/:user_id")
  async getUserBlogs(@Param("user_id") userId: string) {
    return this.blogService.getUserBlogs(userId);
  }

  @Patch(":blog_id/view")
  async viewBlog(@Param("blog_id") blogId: string) {
    return this.blogService.viewBlog(blogId);
  }

  @Patch(":blog_id/like")
  async likeBlog(@Param("blog_id") blogId: string) {
    return this.blogService.likeBlog(blogId);
  }
}

import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';


@Controller('blogs')
@UseGuards(AuthGuard("jwt"))
export class BlogsController {
    constructor(private blogService: BlogsService){}
    @Get()
    async getBlogs() {
        return this.blogService.getBlogs()
    }

    @Post()
    async createBlog(@Body() body: CreateBlogDto, @Req() req) {
        return this.blogService.createBlog(body, req.user.userId as string)
    }


    @Get("me")
    async getMyBlogs(@Req() req: any) {
        return this.blogService.getUserBlogs(req.user.userId as string)
    }

    @Get(":blog_id")
    async getBlogById(@Param("blog_id") blogId: string) {
        return this.blogService.getBlogById(blogId)
    }


    @Get("user/:user_id")
    async getUserBlogs(@Param("user_id") userId: string) {
        return this.blogService.getUserBlogs(userId)
    }

    @Patch(":blog_id/view")
    async viewBlog(@Param("blog_id") blogId: string) {
        return this.blogService.viewBlog(blogId)
    }

    @Patch(":blog_id/like")
    async likeBlog(@Param("blog_id") blogId: string) {
        return this.blogService.likeBlog(blogId)
    }
}

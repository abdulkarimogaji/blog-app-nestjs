import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
@UseGuards(AuthGuard("jwt"))
export class CommentsController {
    constructor(private commentsService: CommentsService) {}


    @Post()
    async createComment(@Body() body: CreateCommentDto, @Req() req: any) {
        return this.commentsService.createComment(body, req.user.userId)
    }

    @Delete(":id")
    async deleteComment(@Req() req:any) {
        return this.commentsService.deleteComment(req.params.id, req.user.userRoles, req.user.userId)
    }
}

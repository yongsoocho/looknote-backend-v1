import {
  Body,
  Controller,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../service/comment.service';
import { JwtAuthGaurd } from 'src/util/jwt/jwt.guard';
import { CreateCommentBody, UpdateComment } from '../dto/Comment';
import { CommonResponse } from '../dto/Response';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Test
  @Post('/search')
  async getComments(@Body('id') id, @Query('page') page) {
    const { count, comments } = await this.commentService.getComments(
      Number(id),
      page,
    );
    return { count, comments };
  }

  // Test
  @UseGuards(JwtAuthGaurd)
  @Post('/create')
  async createComment(@Body() body: CreateCommentBody, @Request() req) {
    const newComment = await this.commentService.createComment({
      postId: Number(body.postId),
      content: body.content,
      authorId: Number(req.user.id),
    });
    return { newComment };
  }

  // Test
  @Post('/update')
  @UseGuards(JwtAuthGaurd)
  async updateComment(@Body() body: UpdateComment, @Request() req) {
    const updatedComment = await this.commentService.updateComment(
      body,
      Number(req.user.id),
    );
    return { updatedComment };
  }

  // Test
  @Post('/delete')
  @UseGuards(JwtAuthGaurd)
  async deleteComment(
    @Body('commentId') commentId,
    @Request() req,
  ): Promise<CommonResponse> {
    return await this.commentService.deleteComment(
      Number(commentId),
      Number(req.user.id),
    );
  }
}

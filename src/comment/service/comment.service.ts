import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { CreateComment, UpdateComment } from '../dto/Comment';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // Test
  async getComments(id: number, page = 1) {
    const [count, comments] = await Promise.all([
      this.prisma.comment.count({
        where: {
          postId: id,
        },
      }),
      this.prisma.comment.findMany({
        where: {
          postId: id,
        },
        include: {
          author: {
            select: {
              profile: true,
              nickname: true,
              id: true,
            },
          },
        },
        take: 30,
        skip: Number(page) - 1,
      }),
    ]);
    return { count, comments };
  }

  // Test
  async createComment(payload: CreateComment) {
    return this.prisma.comment.create({
      data: {
        ...payload,
      },
    });
  }

  // Test
  async updateComment(payload: UpdateComment, authorId: number) {
    const result: boolean = await this.userService.isHaveAuthority(
      Number(authorId),
    );
    if (result) {
      const comment = await this.isCommentExist(Number(payload.commentId));
      if (!comment) {
        throw new HttpException('Non exist comment', HttpStatus.NOT_FOUND);
      }
      return this.prisma.comment.update({
        where: {
          id: Number(payload.commentId),
        },
        data: {
          content: payload.content,
        },
      });
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  // Test
  async deleteComment(commentId: number, authorId: number) {
    const result: boolean = await this.userService.isHaveAuthority(
      Number(authorId),
    );
    if (result) {
      const comment = await this.isCommentExist(commentId);
      if (!comment) {
        throw new HttpException('Non exist comment', HttpStatus.NOT_FOUND);
      }
      await this.prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: `comment id ${commentId} is deleted`,
      };
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async isCommentExist(commentId: number): Promise<boolean> {
    const result = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (result) return true;
    else return false;
  }
}

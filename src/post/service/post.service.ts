import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { UserService } from 'src/user/service/user.service';
import { count } from 'rxjs';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getAllPosts(page = 1) {
    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        skip: 30 * (Number(page) - 1),
        take: 30,
        orderBy: { id: 'desc' },
      }),
      this.prisma.post.count(),
    ]);
    return { posts, count };
  }

  async getDetailPost(postId: number, userId: number) {
    const [post, likesCheck] = await Promise.all([
      this.prisma.post.findUnique({
        where: {
          id: userId,
        },
        include: {
          author: {
            select: {
              nickname: true,
              profile: true,
              id: true,
            },
          },
          comments: {
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
          },
        },
      }),
      this.prisma.likes.findUnique({
        where: {
          authorId_postId: {
            authorId: userId,
            postId: postId,
          },
        },
      }),
    ]);
    if (!post) {
      throw new HttpException('cannot found post', HttpStatus.NOT_FOUND);
    }
    if (!likesCheck) {
      return {
        ...post,
        isLike: false,
      };
    } else {
      return {
        ...post,
        isLike: true,
      };
    }
  }

  async findPostById(id: number, page = 1) {
    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          id: {
            gte: id,
          },
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
      }),
      this.prisma.post.count({
        where: {
          id: {
            gte: id,
          },
        },
      }),
    ]);
    return { posts, count };
  }

  async findPostsByAuthorId(authorId: number, page = 1) {
    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          authorId,
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.post.count({
        where: {
          authorId,
        },
      }),
    ]);
    return { posts, count };
  }

  // async oldGetFilteredPostsByTag(tagsId) {
  //   const [posts, count] = await Promise.all([
  //     this.prisma.tagOnPost.findMany({
  //       distinct: ['postId'],
  //       where: {
  //         tagId: {
  //           in: tagsId,
  //         },
  //       },
  //       include: {
  //         post: true,
  //       },
  //     }),
  //     this.prisma.tagOnPost.count({
  //       where: {
  //         tagId: {
  //           in: tagsId,
  //         },
  //       },
  //     }),
  //   ]);
  //   return { posts, count };
  // }

  // async getFilteredPostsByTag(tagsId, authorId) {
  //   const [posts, count] = await Promise.all([
  //     this.prisma.tagOnPost.findMany({
  //       distinct: ['postId'],
  //       where: {
  //         tagId: {
  //           in: tagsId,
  //         },
  //         post: {
  //           authorId,
  //         },
  //       },
  //       include: {
  //         post: true,
  //       },
  //     }),
  //     this.prisma.tagOnPost.count({
  //       where: {
  //         tagId: {
  //           in: tagsId,
  //         },
  //         post: {
  //           authorId,
  //         },
  //       },
  //     }),
  //   ]);
  //   return { posts, count };
  // }

  async createPost(body) {
    const newPost = await this.prisma.post.create({
      data: {
        ...body,
      },
    });
    return newPost;
  }

  // async createTagOnPost(postId: number, tagsId: Array<number>) {
  //   const tagsOnPost = await Promise.all(
  //     tagsId.map((item) =>
  //       this.prisma.tagOnPost.create({
  //         data: {
  //           postId,
  //           tagId: item,
  //         },
  //       }),
  //     ),
  //   );
  //   return tagsOnPost;
  // }

  async deletePost(id: number, user) {
    const authorCheck = await this.userService.checkAuthor(user);
    if (authorCheck) {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });
      if (!post) {
        throw new HttpException('not found', HttpStatus.NOT_FOUND);
      }
      await this.prisma.post.delete({
        where: {
          id,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      };
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async patchImagePost(id: number, imageURL, user) {
    const authorCheck = await this.userService.checkAuthor(user);
    if (authorCheck) {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });
      if (!post) {
        throw new HttpException('not found', HttpStatus.NOT_FOUND);
      }
      return this.prisma.post.update({
        where: {
          id,
        },
        data: {
          imageURL,
        },
      });
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async patchDataPost(id, payload, user) {
    const authorCheck = await this.userService.checkAuthor(user);
    if (authorCheck) {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });
      if (!post) {
        throw new HttpException('not found', HttpStatus.NOT_FOUND);
      }
      return this.prisma.post.update({
        where: {
          id,
        },
        data: {
          ...payload,
        },
      });
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}

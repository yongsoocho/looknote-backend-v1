import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { logger } from 'src/util/winston';
import mailer from '../../util/mailer/index';
import { v4 } from 'uuid';
import { RedisClient } from '../../util/redis/index';
import { Cron } from '@nestjs/schedule';
import { join } from 'path';
import { zipLogs } from '../../util/zip/index';
import { readFileSync } from 'fs';
import { LocalUserLoginBody } from '../dto/UserLogin';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Test
  async isHaveAuthority(userId: number): Promise<boolean> {
    const user = this.prisma.user.findUnique({ where: { id: userId } });
    if (user == undefined || !user) {
      return false;
    } else {
      return true;
    }
  }

  async getAllUsers(page = 1) {
    const [users, count] = await Promise.all([
      this.prisma.user.findMany({
        skip: 30 * (Number(page) - 1),
        take: 30,
      }),
      this.prisma.user.count({}),
    ]);
    return { users, count };
  }

  async getUserCody(userId, page = 1) {
    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          authorId: userId,
        },
        take: 30,
        skip: 30 * (Number(page) - 1),
      }),
      this.prisma.post.count({
        where: {
          authorId: userId,
        },
      }),
    ]);
    return { posts, count };
  }

  // Test
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        agree: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        profile: true,
        provider: true,
        weight: true,
        createdAt: true,
        point: true,
        pointSum: true,
      },
    });
    if (user === null) return false;
    return user;
  }

  async checkUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        agree: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        profile: true,
        provider: true,
        weight: true,
        createdAt: true,
        point: true,
        pointSum: true,
      },
    });
    if (user == null) return false;
    else {
      if (user.provider === 'LOCAL') {
        return true;
      } else {
        return 'needSocialLogin';
      }
    }
  }

  async findUserByNickname(nickname: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        nickname,
      },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        agree: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        profile: true,
        provider: true,
        weight: true,
        createdAt: true,
        point: true,
        pointSum: true,
      },
    });
    if (user === null) return false;
    return user;
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user === null) return false;
    return user;
  }

  async createUser(body) {
    const hash = await bcrypt.hash(body.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...body,
        password: hash,
        admin: false,
      },
    });
    return newUser;
  }

  async localLogin(body: LocalUserLoginBody) {
    const { email, password } = body;
    const user: any = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new Error(`ID doesn't exist`);
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw new Error(`PW doesn't exist`);
    delete user.password;
    delete user.snsId;
    delete user.deletedAt;
    delete user.status;
    delete user.reason;
    return { user, token: this.jwtService.sign(user) };
  }

  async localEmailCheck(email) {
    const exEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (exEmail) {
      return 'rejected';
    } else {
      return 'fulfilled';
    }
  }

  async localNicknameCheck(nickname) {
    const exNickname = await this.prisma.user.findUnique({
      where: {
        nickname,
      },
    });
    if (exNickname) {
      return 'rejected';
    } else {
      return 'fulfilled';
    }
  }

  async createAdmin(body) {
    const hash = await bcrypt.hash(body.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...body,
        password: hash,
        admin: true,
      },
    });
    return newUser;
  }

  async setAdmin(id: number) {
    await this.prisma.user.update({
      where: { id },
      data: {
        admin: true,
      },
    });
    return;
  }

  async checkAuthor(user) {
    const exUser = await this.findUserById(Number(user.id));
    if (!exUser) {
      return false;
    } else if (exUser.email === user.email || exUser.admin) {
      return true;
    } else {
      logger.error('checkAuthor Error');
    }
  }

  async codeSend(email, file) {
    const checkEmail = await this.checkUserByEmail(email);
    if (checkEmail) {
      return 'inUse';
    } else {
      const newCode = v4().slice(0, 6);
      const exCode = await RedisClient.get(`${email}_code`);
      if (exCode) {
        await RedisClient.set(`${email}_code`, newCode);
        mailer(
          file,
          { code: newCode },
          {
            to: email,
            subject: '[LookNote] 재요청하신 인증번호를 안내드립니다.',
          },
        );
        return 'fulfilled';
      } else {
        await RedisClient.set(`${email}_code`, newCode);
        mailer(
          file,
          { code: newCode },
          {
            to: email,
            subject: '[LookNote] 요청하신 인증번호를 안내드립니다.',
          },
        );
        return 'fulfilled';
      }
    }
  }

  async codeCheck(email, code) {
    const exCode = await RedisClient.get(`${email}_code`);
    if (exCode === code) {
      return 'fulfilled';
    } else {
      return 'rejected';
    }
  }

  async codeFindSend(email, file) {
    const checkEmail = await this.prisma.user.findUnique({ where: { email } });
    if (!checkEmail) {
      return 'rejected';
    } else {
      const newCode = v4().slice(0, 6);
      const exCode = await RedisClient.get(`${email}_code`);
      if (exCode) {
        await RedisClient.set(`${email}_code`, newCode);
        mailer(
          file,
          { code: newCode },
          {
            to: email,
            subject: '[LookNote] 재요청하신 인증번호를 안내드립니다.',
          },
        );
        return 'fulfilled';
      } else {
        await RedisClient.set(`${email}_code`, newCode);
        mailer(
          file,
          { code: newCode },
          {
            to: email,
            subject: '[LookNote] 요청하신 인증번호를 안내드립니다.',
          },
        );
        return 'fulfilled';
      }
    }
  }

  async resetCodeSend(email, file) {
    const checkEmail = await this.prisma.user.findUnique({ where: { email } });
    if (!checkEmail) {
      return 'rejected';
    } else {
      const newCode = v4().slice(0, 6);
      const exCode = await RedisClient.get(`${email}_code`);
      if (exCode) {
        await RedisClient.set(`${email}_code`, newCode);
        mailer(
          file,
          { code: newCode },
          {
            to: email,
            subject: '[LookNote] 재요청하신 인증번호를 안내드립니다.',
          },
        );
        return 'fulfilled';
      } else {
        await RedisClient.set(`${email}_code`, newCode);
        mailer(
          file,
          { code: newCode },
          {
            to: email,
            subject: '[LookNote] 요청하신 인증번호를 안내드립니다.',
          },
        );
        return 'fulfilled';
      }
    }
  }

  async resetCodeCheck(email, code) {
    const exCode = await RedisClient.get(`${email}_code`);
    if (exCode == code) {
      return 'fulfilled';
    } else if (exCode != code) {
      return 'rejected';
    }
  }

  async resetPassword(email, password, code) {
    const result = await this.resetCodeCheck(email, code);
    if (result == 'fulfilled') {
      const hash = await bcrypt.hash(password, 10);
      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hash,
        },
      });
      return 'fulfilled';
    } else {
      return 'rejected';
    }
  }

  async deleteUser(email, reason) {
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        status: 'DELETE',
        deletedAt: new Date(),
        reason,
      },
    });
    return 'fulfilled';
  }

  async deleteUserCheck(email, password) {
    const exUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    const result = await bcrypt.compare(password, exUser.password);
    if (!result) {
      return 'rejected';
    }
    return 'fulfilled';
  }

  async deleteUserAdmin(email) {
    await this.prisma.user.delete({
      where: {
        email,
      },
    });
    return 'fulfilled';
  }

  async changeProfile(payload) {
    await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        profile: payload.imageURL,
      },
    });
  }

  async point(userId, point) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        point: {
          increment: Number(point),
        },
      },
    });
  }

  // Test
  async getTagCloset(id, page = 1) {
    const [tags, count] = await Promise.all([
      await this.prisma.tagCloset.findMany({
        where: {
          authorId: id,
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
        include: {
          tag: true,
        },
      }),
      await this.prisma.tagCloset.count({
        where: {
          authorId: id,
        },
      }),
    ]);
    return { tags, count };
  }

  // Test
  async toggleTagCloset(id: number, tagId: number) {
    const tagCloset = await this.prisma.tagCloset.findUnique({
      where: {
        authorId_tagId: {
          authorId: id,
          tagId: tagId,
        },
      },
    });
    if (tagCloset) {
      await this.prisma.tagCloset.delete({
        where: {
          authorId_tagId: {
            authorId: id,
            tagId: tagId,
          },
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'deleted success',
      };
    } else {
      return this.prisma.tagCloset.create({
        data: {
          authorId: id,
          tagId: tagId,
        },
      });
    }
  }

  async getLikesUsers(postId: number) {
    return this.prisma.likes.findMany({
      where: {
        postId,
      },
      include: {
        author: {
          select: {
            profile: true,
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    });
  }

  async getCountUsers(postId: number) {
    const count = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {},
    });
    return count;
  }

  async toggleLike(id, postId) {
    const like = await this.prisma.likes.findUnique({
      where: {
        authorId_postId: {
          authorId: id,
          postId: postId,
        },
      },
    });
    if (like) {
      await Promise.all([
        this.prisma.likes.delete({
          where: {
            authorId_postId: {
              authorId: id,
              postId: postId,
            },
          },
        }),
        this.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        }),
      ]);
      return {
        statusCode: HttpStatus.OK,
        message: 'deleted success',
      };
    } else {
      const [newLikes, _] = await Promise.all([
        this.prisma.likes.create({
          data: {
            authorId: id,
            postId: postId,
          },
        }),
        this.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
      ]);
      return newLikes;
    }
  }

  // Test
  async patchUser(id, payload) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
    return 'fulfilled';
  }

  @Cron('1 1 * * 0', {
    timeZone: 'Asia/Seoul',
  })
  async logmailer() {
    try {
      zipLogs();
      const file = readFileSync(
        join(process.cwd(), 'src', 'static', 'empty.html'),
        'utf-8',
      );
      mailer(
        file,
        {},
        {
          to: 'looknote.official@befferent.co.kr',
          subject: '[LookNote Weekly] 이번주 서버 에러',
          attachments: [
            {
              filename: 'logs.zip',
              path: join(process.cwd(), 'logs.zip'),
            },
          ],
        },
      );
      return;
    } catch (error) {
      return logger.error(error);
    }
  }

  async submitReport(postId: number, userId: number) {
    return this.prisma.report.create({
      data: {
        postId,
        authorId: userId,
      },
    });
  }
}

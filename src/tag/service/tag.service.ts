import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { UserService } from 'src/user/service/user.service';
import { Status } from '../dto/tag.dto';

@Injectable()
export class TagService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getAllTags(page = 1) {
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        skip: 30 * (Number(page) - 1),
        take: 30,
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.tag.count({}),
    ]);
    return { tags, count };
  }

  async findTagsById(id: number, page = 1) {
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          id: {
            gte: id,
          },
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
      }),
      this.prisma.tag.count({
        where: {
          id: {
            gte: id,
          },
        },
      }),
    ]);
    return { tags, count };
  }

  async findTagById(id: number) {
    const tag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    });
    if (tag) {
      return tag;
    } else {
      throw new HttpException('tag is not founded', HttpStatus.NOT_FOUND);
    }
  }

  async findByUserId(id: number, page = 1) {
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          authorId: id,
        },
        take: 30,
        skip: (Number(page) - 1) * 30,
        orderBy: { id: 'desc' },
      }),
      this.prisma.tag.count({
        where: {
          authorId: id,
        },
      }),
    ]);
    return { tags, count };
  }

  // async getFilteredTagsByCategory(category, page = 1) {
  //   const [tags, count] = await Promise.all([
  //     this.prisma.tag.findMany({
  //       where: {
  //         ...category,
  //       },
  //       skip: 30 * (Number(page) - 1),
  //       take: 30,
  //     }),
  //     this.prisma.tag.count({
  //       where: {
  //         ...category,
  //       },
  //     }),
  //   ]);
  //   return { tags, count };
  // }

  async getFilteredTagsByDetails(details, page = 1) {
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          details: { hasEvery: details },
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
      }),
      this.prisma.tag.count({
        where: {
          details: { hasEvery: details },
        },
      }),
    ]);
    return { tags, count };
  }

  async getFilteredTagsByCategory(ct_ct_001, ct_ct_002, ct_ct_003, page = 1) {
    const category = {
      ct_ct_001,
      ct_ct_002,
      ct_ct_003,
    };
    if (!ct_ct_001) delete category.ct_ct_001;
    if (!ct_ct_002) delete category.ct_ct_002;
    if (!ct_ct_003) delete category.ct_ct_003;
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          ...category,
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
      }),
      this.prisma.tag.count({
        where: {
          ...category,
        },
      }),
    ]);
    return { tags, count };
  }

  async searchFilteredTagsByCategory(
    ct_ct_001,
    ct_ct_002,
    ct_ct_003,
    page = 1,
  ) {
    const category = {
      ct_ct_001,
      ct_ct_002,
      ct_ct_003,
    };
    if (!ct_ct_001) delete category.ct_ct_001;
    if (!ct_ct_002) delete category.ct_ct_002;
    if (!ct_ct_003) delete category.ct_ct_003;
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          ...category,
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
      }),
      this.prisma.tag.count({
        where: {
          ...category,
        },
      }),
    ]);
    return { tags, count };
  }

  async searchFilteredTagsByCategoryWithUser(
    ct_ct_001,
    ct_ct_002,
    ct_ct_003,
    page = 1,
    authorId,
  ) {
    const category = {
      ct_ct_001,
      ct_ct_002,
      ct_ct_003,
    };
    if (!ct_ct_001) delete category.ct_ct_001;
    if (!ct_ct_002) delete category.ct_ct_002;
    if (!ct_ct_003) delete category.ct_ct_003;
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          ...category,
          authorId,
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.tag.count({
        where: {
          ...category,
        },
      }),
    ]);
    return { tags, count };
  }

  async getFilteredTagsByFilter(
    ct_ct_001,
    ct_ct_002,
    ct_ct_003,
    details,
    page = 1,
  ) {
    const category = {
      ct_ct_001,
      ct_ct_002,
      ct_ct_003,
    };
    if (ct_ct_001 === '' || !ct_ct_001) {
      delete category.ct_ct_001;
    }
    if (ct_ct_002 === '' || !ct_ct_002) {
      delete category.ct_ct_002;
    }
    if (ct_ct_003 === '' || !ct_ct_003) {
      delete category.ct_ct_003;
    }
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          ...category,
          details: { hasEvery: details },
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
      }),
      this.prisma.tag.count({
        where: {
          ...category,
          details: { hasEvery: details },
        },
      }),
    ]);
    return { tags, count };
  }

  async searchFilteredTagsByFilter(
    ct_ct_001,
    ct_ct_002,
    ct_ct_003,
    details,
    page = 1,
  ) {
    const category = {
      ct_ct_001,
      ct_ct_002,
      ct_ct_003,
    };
    if (ct_ct_001 === '' || !ct_ct_001) {
      delete category.ct_ct_001;
    }
    if (ct_ct_002 === '' || !ct_ct_002) {
      delete category.ct_ct_002;
    }
    if (ct_ct_003 === '' || !ct_ct_003) {
      delete category.ct_ct_003;
    }
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          ...category,
          details: { hasEvery: details },
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
      }),
      this.prisma.tag.count({
        where: {
          ...category,
          details: { hasEvery: details },
        },
      }),
    ]);
    return { tags, count };
  }

  async searchFilteredTagsByFilterWithUser(
    ct_ct_001,
    ct_ct_002,
    ct_ct_003,
    details,
    page = 1,
    authorId,
  ) {
    const category = {
      ct_ct_001,
      ct_ct_002,
      ct_ct_003,
    };
    if (ct_ct_001 === '' || !ct_ct_001) {
      delete category.ct_ct_001;
    }
    if (ct_ct_002 === '' || !ct_ct_002) {
      delete category.ct_ct_002;
    }
    if (ct_ct_003 === '' || !ct_ct_003) {
      delete category.ct_ct_003;
    }
    const [tags, count] = await Promise.all([
      this.prisma.tag.findMany({
        where: {
          ...category,
          details: { hasEvery: details },
          authorId,
        },
        skip: 30 * (Number(page) - 1),
        take: 30,
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.tag.count({
        where: {
          ...category,
          details: { hasEvery: details },
        },
      }),
    ]);
    return { tags, count };
  }

  // async getFilteredTagsIdByCategory(payload, page = 1) {
  //   const [posts, count] = await Promise.all([
  //     this.prisma.tagOnPost.findMany({
  //       distinct: ['postId'],
  //       where: {
  //         tag: {
  //           ...payload,
  //         },
  //       },
  //       include: {
  //         post: true,
  //         tag: true,
  //       },
  //       orderBy: {
  //         postId: 'desc',
  //       },
  //       take: 30,
  //       skip: 30 * (Number(page) - 1),
  //     }),
  //     this.prisma.tagOnPost.count({
  //       where: {
  //         tag: {
  //           ...payload,
  //         },
  //       },
  //     }),
  //   ]);
  //
  //   return { posts, count };
  // }

  async getFilteredTagsIdByCategoryWithAuthor(payload, page = 1) {
    delete payload.authorId;
    const tags = await this.prisma.tag.findMany({
      where: {
        ...payload,
      },
      orderBy: { id: 'desc' },
      skip: 30 * (page - 1),
      take: 30,
    });
    return tags;
  }

  // async getFilteredTagsIdByFilter(payload, details, page = 1) {
  //   const [posts, count] = await Promise.all([
  //     this.prisma.tagOnPost.findMany({
  //       where: {
  //         tag: {
  //           ...payload,
  //           details: { hasEvery: details },
  //         },
  //       },
  //       include: {
  //         tag: true,
  //         post: true,
  //       },
  //       orderBy: {
  //         postId: 'desc',
  //       },
  //       skip: 30 * (page - 1),
  //       take: 30,
  //     }),
  //     this.prisma.tagOnPost.count({
  //       where: {
  //         tag: {
  //           ...payload,
  //           details: { hasEvery: details },
  //         },
  //       },
  //     }),
  //   ]);
  //   return { posts, count };
  // }

  // Test
  async getFilteredTagWhichInClosetOnlyId(
    payload,
    userId: number,
    page = 1,
    detailsArray,
  ) {
    if (payload.details === undefined) {
      delete payload.details;
      const [tags, count] = await Promise.all([
        this.prisma.tagCloset.findMany({
          where: {
            authorId: userId,
            tag: {
              ...payload,
            },
          },
          include: {
            tag: true,
          },
          skip: 30 * (page - 1),
          take: 30,
        }),
        this.prisma.tagCloset.count({
          where: {
            authorId: userId,
            tag: {
              ...payload,
            },
          },
        }),
      ]);
      return { tags, count };
    } else {
      delete payload.details;
      const [tags, count] = await Promise.all([
        this.prisma.tagCloset.findMany({
          where: {
            authorId: userId,
            tag: {
              ...payload,
              details: { hasEvery: detailsArray },
            },
          },
          include: {
            tag: true,
          },
          skip: 30 * (page - 1),
          take: 30,
        }),
        this.prisma.tagCloset.count({
          where: {
            authorId: userId,
            tag: {
              ...payload,
              details: { hasEvery: detailsArray },
            },
          },
        }),
      ]);
      return { tags, count };
    }
  }

  async getFilteredTagWhichInCloset(tagsId) {
    return this.prisma.tagCloset.findMany({
      where: {
        tagId: {
          in: tagsId,
        },
      },
    });
  }

  async getFilteredTagsIdByFilterWithAuthor(body, details, page = 1) {
    delete body.authorId;
    const tags = await this.prisma.tag.findMany({
      where: {
        ...body,
        details: { hasEvery: details },
      },
      select: {
        id: true,
      },
      orderBy: { id: 'desc' },
      take: 30,
      skip: 30 * (page - 1),
    });
    return tags;
  }

  async createTag(body) {
    const newTag = await this.prisma.tag.create({
      data: {
        ...body,
      },
    });
    return newTag;
  }

  async deleteTag(id: number, user) {
    const authorCheck = await this.userService.checkAuthor(user);
    if (authorCheck) {
      await this.prisma.tag.delete({
        where: {
          id,
        },
      });
    }
    return;
  }

  async patchTag(id: number, imageURL, user) {
    const authorCheck = await this.userService.checkAuthor(user);
    if (authorCheck) {
      await this.prisma.tag.update({
        where: {
          id,
        },
        data: {
          imageURL,
        },
      });
    }
    return;
  }

  async patchFilter(id, payload, user) {
    const authorCheck = await this.userService.checkAuthor(user);
    delete payload.id;
    if (authorCheck) {
      await this.prisma.tag.update({
        where: {
          id,
        },
        data: {
          ...payload,
          details: payload.details.split(','),
        },
      });
    }
    return;
  }
}

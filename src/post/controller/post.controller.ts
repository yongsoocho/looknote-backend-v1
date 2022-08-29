import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './../service/post.service';
import { DetailsPipe } from './../../util/pipe/details.pipe';
import { TagService } from './../../tag/service/tag.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGaurd } from 'src/util/jwt/jwt.guard';
import { TagsPipe } from 'src/util/pipe/tags.pipe';
import { FilterBody, FilterWithAuthorIdBody } from '../dto/FilterBody';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly tagService: TagService,
  ) {}

  @Get('/search')
  async getAllPosts(@Query('page') page) {
    const { posts, count } = await this.postService.getAllPosts(page);
    return { posts, count };
  }

  @Post('/search/id')
  async findPostById(@Body('id') id, @Query('page') page) {
    const { posts, count } = await this.postService.findPostById(
      Number(id),
      page,
    );
    return { posts, count };
  }

  @Post('/search/authorid')
  async findPostsByAuthorId(@Body('authorId') authorId, @Query('page') page) {
    const { posts, count } = await this.postService.findPostsByAuthorId(
      Number(authorId),
      page,
    );
    return { posts, count };
  }

  // // Test
  // @Post('/search/authorid/filter')
  // async findPostsByAuthorIdWithFilter(
  //   @Body() body: FilterWithAuthorIdBody,
  //   @Body('details', DetailsPipe) details,
  //   @Body('authorId') authorId,
  //   @Query('page') page,
  // ) {
  //   if (body.details === undefined) {
  //     const tags = await this.tagService.getFilteredTagsIdByCategoryWithAuthor(
  //       body,
  //       page,
  //     );
  //     const tagsId = [];
  //     tags.forEach((item) => tagsId.push(item.id));
  //     const { posts, count } = await this.postService.getFilteredPostsByTag(
  //       tagsId,
  //       Number(authorId),
  //     );
  //     return { posts, count };
  //   } else {
  //     const tags = await this.tagService.getFilteredTagsIdByFilterWithAuthor(
  //       body,
  //       details,
  //       page,
  //     );
  //     const tagsId = [];
  //     tags.forEach((item) => tagsId.push(item.id));
  //     const { posts, count } = await this.postService.getFilteredPostsByTag(
  //       tagsId,
  //       Number(authorId),
  //     );
  //     return { posts, count };
  //   }
  // }

  // Test
  @Post('/search/detail')
  @UseGuards(JwtAuthGaurd)
  async getDetailPost(@Body('id') id, @Req() req) {
    return await this.postService.getDetailPost(
      Number(id),
      Number(req.user.id),
    );
  }

  // To do fix -> 22.01.19
  // @Post('/search/tags')
  // async getFilteredPosts(
  //   @Body() body: FilterBody,
  //   @Body('ct_ct_001') ct_ct_001: string,
  //   @Body('ct_ct_002') ct_ct_002: string,
  //   @Body('ct_ct_003') ct_ct_003: string,
  //   @Body('details', DetailsPipe) details,
  //   @Query('page') page,
  // ) {
  //   if (body.details === undefined) {
  //     const { posts, count } =
  //       await this.tagService.getFilteredTagsIdByCategory(body, page);
  //     return { posts, count };
  //   } else {
  //     const { posts, count } = await this.tagService.getFilteredTagsIdByFilter(
  //       body,
  //       details,
  //       page,
  //     );
  //     return { posts, count };
  //   }
  // }

  @UseGuards(JwtAuthGaurd)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/post/create')
  async createPost(@UploadedFiles() images, @Body() body, @Req() req) {
    const imageURL = images.map((e) => {
      return e.location
        .split('/')
        .map((ele, i) => {
          if (i === 2) {
            return 'photo.looknote.co.kr';
          } else {
            return ele;
          }
        })
        .join('/');
    });
    return await this.postService.createPost({
      imageURL,
      authorId: Number(req.user.id),
    });
  }

  @UseGuards(JwtAuthGaurd)
  @Post('/post/delete')
  async deletePost(@Body('id') id, @Req() req) {
    return await this.postService.deletePost(Number(id), req.user);
  }

  @UseGuards(JwtAuthGaurd)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/post/patch')
  async patchImagePost(@UploadedFiles() images, @Body('id') id, @Req() req) {
    return await this.postService.patchImagePost(
      Number(id),
      images[0].location,
      req.user,
    );
  }

  @UseGuards(JwtAuthGaurd)
  @Patch('/post/patch')
  async patchDataPost(@Body('id') id, @Body() body, @Req() req) {
    delete body.id;
    return await this.postService.patchDataPost(Number(id), body, req.user);
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGaurd } from 'src/util/jwt/jwt.guard';
import { TagService } from '../service/tag.service';
import { DetailsPipe } from './../../util/pipe/details.pipe';
import { AdminGuard } from '../../util/guard/admin.guard';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/search')
  async getAllTags(@Query('page') page) {
    const { tags, count } = await this.tagService.getAllTags(page);
    return { tags, count };
  }

  @Post('/search/id')
  async findTagsById(@Body('id') id, @Query('page') page) {
    const { tags, count } = await this.tagService.findTagsById(
      Number(id),
      page,
    );
    return { tags, count };
  }

  @Post('/search/detail/id')
  async findTagById(@Body('id') id) {
    return await this.tagService.findTagById(Number(id));
  }

  @Post('/search/user/id')
  async findByUserId(@Body('authorId') authorId, @Body('page') page) {
    const { tags, count } = await this.tagService.findByUserId(
      Number(authorId),
      page,
    );
    return { tags, count };
  }

  @Post('/search/details')
  async getFilteredTagsByDetails(
    @Body('details', DetailsPipe) details: Array<string>,
    @Query('page') page,
  ) {
    const { tags, count } = await this.tagService.getFilteredTagsByDetails(
      details,
      page,
    );
    return { tags, count };
  }

  // To do fix -> 22.01.29 fix -> 22.02.06 fix
  @Post('/search/filter')
  async getFilteredTagsByFilter(
    @Body('ct_ct_001') ct_ct_001: string,
    @Body('ct_ct_002') ct_ct_002: string,
    @Body('ct_ct_003') ct_ct_003: string,
    @Body('details', DetailsPipe) details,
    @Query('page') page,
  ) {
    if (details.length === 0) {
      const { tags, count } = await this.tagService.getFilteredTagsByCategory(
        ct_ct_001,
        ct_ct_002,
        ct_ct_003,
        page,
      );
      return { tags, count };
    } else {
      const { tags, count } = await this.tagService.getFilteredTagsByFilter(
        ct_ct_001,
        ct_ct_002,
        ct_ct_003,
        details,
        page,
      );
      return { tags, count };
    }
  }

  // sh add
  @Post('/search/filter/tags')
  async searchFilteredTagsByFilter(
    @Body('ct_ct_001') ct_ct_001: string,
    @Body('ct_ct_002') ct_ct_002: string,
    @Body('ct_ct_003') ct_ct_003: string,
    @Body('details', DetailsPipe) details,
    @Query('page') page,
  ) {
    if (details.length === 0) {
      const { tags, count } =
        await this.tagService.searchFilteredTagsByCategory(
          ct_ct_001,
          ct_ct_002,
          ct_ct_003,
          page,
        );
      return { tags, count };
    } else {
      const { tags, count } = await this.tagService.searchFilteredTagsByFilter(
        ct_ct_001,
        ct_ct_002,
        ct_ct_003,
        details,
        page,
      );
      return { tags, count };
    }
  }

  // sh add
  @Post('/search/filter/tag/userid')
  async searchFilteredTagsByFilterWithUser(
    @Body('ct_ct_001') ct_ct_001: string,
    @Body('ct_ct_002') ct_ct_002: string,
    @Body('ct_ct_003') ct_ct_003: string,
    @Body('details', DetailsPipe) details,
    @Body('authorId') authorId,
    @Query('page') page,
  ) {
    if (details.length === 0) {
      const { tags, count } =
        await this.tagService.searchFilteredTagsByCategoryWithUser(
          ct_ct_001,
          ct_ct_002,
          ct_ct_003,
          page,
          Number(authorId),
        );
      return { tags, count };
    } else {
      const { tags, count } =
        await this.tagService.searchFilteredTagsByFilterWithUser(
          ct_ct_001,
          ct_ct_002,
          ct_ct_003,
          details,
          page,
          Number(authorId),
        );
      return { tags, count };
    }
  }

  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/tag/create')
  async createManagerClothes(
    @UploadedFiles() images: any,
    @Body() body,
    @Body('details', DetailsPipe) details,
    @Req() req,
  ) {
    const newTag = await this.tagService.createTag({
      ...body,
      details,
      imageURL: images[0].location,
      authorId: Number(req.user.id),
    });
    return newTag;
  }

  @UseGuards(JwtAuthGaurd)
  @Post('/tag/delete')
  async deleteClothes(@Body('id') id, @Req() req) {
    await this.tagService.deleteTag(Number(id), req.user);
    return;
  }

  @UseGuards(JwtAuthGaurd)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/tag/patch')
  async patchClothes(@UploadedFiles() images: any, @Body('id') id, @Req() req) {
    await this.tagService.patchTag(Number(id), images[0].location, req.user);
    return;
  }

  @UseGuards(JwtAuthGaurd)
  @Post('/tag/patch/content')
  async patchClothesFilter(@Body() body, @Req() req) {
    await this.tagService.patchFilter(Number(body.id), body.content, req.user);
    return;
  }
}

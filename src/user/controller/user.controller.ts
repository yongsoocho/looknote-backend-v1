import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { logger } from 'src/util/winston';
import { UserService } from './../service/user.service';
import { AdminGuard } from 'src/util/guard/admin.guard';
import { JwtAuthGaurd } from 'src/util/jwt/jwt.guard';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DetailsPipe } from '../../util/pipe/details.pipe';
import { DetailsPipeType, FilterBody } from '../../post/dto/FilterBody';
import { TagService } from '../../tag/service/tag.service';
import { PostService } from '../../post/service/post.service';
import { LocalUserLoginBody } from '../dto/UserLogin';
import { PatchUserBody } from '../dto/PatchUser';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tagService: TagService,
    private readonly postService: PostService,
  ) {}

  // Test
  @Get('/elb')
  healthCheck() {
    return 'health';
  }

  @Get('/search')
  @UseGuards(AdminGuard)
  async getAllUsers(@Query('page') page) {
    const { users, count } = await this.userService.getAllUsers(page);
    return { users, count };
  }

  @Post('/search/user/content')
  @UseGuards(AdminGuard)
  async getUserCody(@Body('id') id, @Query('page') page) {
    const { posts, count } = await this.userService.getUserCody(
      Number(id),
      page,
    );
    return { posts, count };
  }

  // Test
  @Post('/search')
  async getAppUser(@Body() body) {
    if (body.email) {
      return await this.userService.findUserByEmail(body.email);
    } else if (body.nickname) {
      return await this.userService.findUserByNickname(body.nickname);
    } else if (body.id) {
      return await this.userService.findUserById(Number(body.id));
    } else {
      logger.error('getAppUser');
    }
  }

  @UseGuards(JwtAuthGaurd)
  @Get('/relogin')
  async reLogIn(@Request() req) {
    return req.user;
  }

  @Post('/local/join')
  async localJoin(@Body() body) {
    const newUser = this.userService.createUser(body);
    return newUser;
  }

  // Test
  @Post('/local/login')
  async localLogin(@Body() body: LocalUserLoginBody) {
    const { user, token } = await this.userService.localLogin(body);
    return { user, token };
  }

  @Post('/local/emailcheck')
  async localEmailCheck(@Body('email') email) {
    const result = await this.userService.localEmailCheck(email);
    return result;
  }

  @Post('/local/nicknamecheck')
  async localNicknameCheck(@Body('nickname') nickname) {
    const result = await this.userService.localNicknameCheck(nickname);
    return result;
  }

  @Post('/admin/join')
  @UseGuards(AdminGuard)
  async joinAdmin(@Body() body) {
    const newAdmin = await this.userService.createAdmin(body);
    return newAdmin;
  }

  @Post('/admin/set')
  @UseGuards(AdminGuard)
  async setAdmin(@Body('id') id) {
    await this.userService.setAdmin(Number(id));
    return;
  }

  @Post('/code/send')
  async codeSend(@Body('email') email: string) {
    const file = readFileSync(
      join(process.cwd(), 'src', 'static', 'code.html'),
      'utf-8',
    );
    const result = await this.userService.codeSend(email, file);
    return result;
  }

  @Post('/code/check')
  async codeCheck(@Body('email') email: string, @Body('code') code: string) {
    const result = await this.userService.codeCheck(email, code);
    return result;
  }

  @Post('/code/find/send')
  async codeFindSend(@Body('email') email: string) {
    const file = readFileSync(
      join(process.cwd(), 'src', 'static', 'code.html'),
      'utf-8',
    );
    const result = await this.userService.codeFindSend(email, file);
    return result;
  }

  @Post('/reset/password')
  async resetPassword(
    @Body('password') password: string,
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    const result = await this.userService.resetPassword(email, password, code);
    return result;
  }

  @Post('/reset/code/send')
  async resetCodeSend(@Body('email') email: string) {
    const file = readFileSync(
      join(process.cwd(), 'src', 'static', 'code.html'),
      'utf-8',
    );
    const result = await this.userService.resetCodeSend(email, file);
    return result;
  }

  @Post('/reset/code/check')
  async resetCodeCheck(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    const result = await this.userService.resetCodeCheck(email, code);
    return result;
  }

  @Post('/delete/user')
  @UseGuards(JwtAuthGaurd)
  async deleteUser(
    @Body('email') email: string,
    @Body('reason') reason: string,
  ) {
    const result = await this.userService.deleteUser(email, reason);
    return result;
  }

  @Post('/delete/check')
  @UseGuards(JwtAuthGaurd)
  async deleteUserCheck(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const result = await this.userService.deleteUserCheck(email, password);
    return result;
  }

  @Post('/delete/admin/user')
  @UseGuards(AdminGuard)
  async deleteUserAdmin(@Body('email') email: string) {
    const result = await this.userService.deleteUserAdmin(email);
    return result;
  }

  @UseGuards(JwtAuthGaurd)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/change/profile')
  async changeProfile(@UploadedFiles() images, @Req() req) {
    await this.userService.changeProfile({
      id: req.user.id,
      imageURL: images[0].location,
    });
    return;
  }

  // Test
  @Get('/tag/closet')
  @UseGuards(JwtAuthGaurd)
  async getTagCloset(@Query('page') page, @Req() req) {
    const { tags, count } = await this.userService.getTagCloset(
      Number(req.user.id),
      page,
    );
    return { tags, count };
  }

  // Test
  @Post('/tag/closet')
  @UseGuards(JwtAuthGaurd)
  async toggleTagCloset(@Body('tagId') tagId, @Req() req) {
    return await this.userService.toggleTagCloset(
      Number(req.user.id),
      Number(tagId),
    );
  }

  @Post('/like/user')
  async getLikesUsers(@Body('postId') postId) {
    return await this.userService.getLikesUsers(Number(postId));
  }

  @Post('/like/count')
  async getCountUsers(@Body('postId') postId) {
    const count = await this.userService.getCountUsers(Number(postId));
    return count;
  }

  @Post('/like')
  @UseGuards(JwtAuthGaurd)
  async toggleLike(@Body('postId') postId, @Request() req) {
    return await this.userService.toggleLike(
      Number(req.user.id),
      Number(postId),
    );
  }

  // Test
  @Post('/patch/user')
  @UseGuards(JwtAuthGaurd)
  async patchUser(@Body() body: PatchUserBody, @Req() req) {
    return await this.userService.patchUser(Number(req.user.id), body);
  }

  @Post('/user/point')
  @UseGuards(AdminGuard)
  async point(@Body('userId') userId, @Body('point') point) {
    await this.userService.point(userId, point);
  }

  // Test
  @Post('/tag/closet/filter')
  @UseGuards(JwtAuthGaurd)
  async getTagClosetWithFilter(
    @Body() body: FilterBody,
    @Body('details', DetailsPipe) details,
    @Query('page') page,
    @Req() req,
  ) {
    if (body.details === undefined) {
      const { tags, count } =
        await this.tagService.getFilteredTagWhichInClosetOnlyId(
          body,
          Number(req.user.id),
          page,
          [],
        );
      return { tags, count };
    } else {
      const { tags, count } =
        await this.tagService.getFilteredTagWhichInClosetOnlyId(
          { ...body },
          Number(req.user.id),
          page,
          details,
        );
      return { tags, count };
    }
  }

  @Post('/report')
  @UseGuards(JwtAuthGaurd)
  async submitReport(@Body('postId') postId, @Req() req) {
    return await this.userService.submitReport(
      Number(postId),
      Number(req.user.id),
    );
  }
}

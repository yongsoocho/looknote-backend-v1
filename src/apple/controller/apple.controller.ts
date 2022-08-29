import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppleService } from '../service/apple.service';
import { JwtAuthGaurd } from '../../util/jwt/jwt.guard';
import { CreateAppleUserBody, decodedIdToken } from '../dto/CreateAppleUser';

@Controller('apple')
export class AppleController {
  constructor(private readonly appleService: AppleService) {}

  // Test
  @Post('/join')
  async appleUserJoin(@Body() body: CreateAppleUserBody) {
    const appleUser: decodedIdToken = await this.appleService.decodeKey(
      body.code,
    );
    const { newUser, user, token } = await this.appleService.appleUserJoin({
      ...body,
      ...appleUser,
    });
    return { newUser, user, token };
  }

  // Test
  @Post('/login')
  async appleUserLogin(@Body('code') code: string) {
    const appleUser = await this.appleService.decodeKey(code);
    const { user, token } = await this.appleService.appleUserLogin(appleUser);
    return { user, token };
  }

  // Test
  @Get('/relogin')
  @UseGuards(JwtAuthGaurd)
  async appleUserReLogin(@Req() req) {
    return req.user;
  }
}

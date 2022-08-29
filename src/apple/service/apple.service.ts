import { HttpException, Injectable } from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { PrismaService } from '../../prisma/service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { decodedIdToken } from '../dto/CreateAppleUser';

@Injectable()
export class AppleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Test
  async appleUserJoin(payload) {
    const exUser = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (exUser) {
      delete exUser.password;
      delete exUser.admin;
      delete exUser.deletedAt;
      delete exUser.status;
      delete exUser.reason;

      return {
        newUser: null,
        user: exUser,
        token: this.jwtService.sign(exUser),
      };
    } else {
      if (
        payload.iss !== 'https://appleid.apple.com' ||
        payload.aud !== 'co.kr.looknote' ||
        payload.email_verified !== 'true'
      ) {
        throw new HttpException('forbidden', 403);
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name,
            nickname: payload.nickname,
            password: payload.c_hash,
            dateOfBirth: payload.dateOfBirth,
            gender: payload.gender,
            height: payload.height,
            provider: 'APPLE',
            snsId: payload.sub,
            admin: false,
          },
        });
        return { newUser, user: null, token: this.jwtService.sign(newUser) };
      }
    }
  }

  // Test
  async decodeKey(code: string): Promise<decodedIdToken> {
    return jwtDecode(code);
  }

  // Test
  async appleUserLogin(appleUser) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: appleUser.email,
      },
    });
    delete user.password;
    delete user.admin;
    delete user.deletedAt;
    delete user.status;
    delete user.reason;
    return { user, token: this.jwtService.sign(user) };
  }
}

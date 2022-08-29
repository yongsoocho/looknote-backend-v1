import { Module } from '@nestjs/common';
import { AppleController } from './controller/apple.controller';
import { AppleService } from './service/apple.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from '../util/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtOption } from '../util/jwt/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register(jwtOption)],
  controllers: [AppleController],
  providers: [AppleService, JwtStrategy],
})
export class AppleModule {}

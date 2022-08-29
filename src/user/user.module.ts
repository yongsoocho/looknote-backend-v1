import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { jwtOption } from 'src/util/jwt/jwt';
import { JwtStrategy } from 'src/util/jwt/jwt.strategy';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { userMulterOption } from '../util/multer';
import { TagModule } from '../tag/tag.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.register(jwtOption),
    ScheduleModule.forRoot(),
    MulterModule.register(userMulterOption),
    forwardRef(() => TagModule),
    forwardRef(() => PostModule),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}

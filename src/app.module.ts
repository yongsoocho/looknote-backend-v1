import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppleModule } from './apple/apple.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    TagModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    AppleModule,
    ScheduleModule.forRoot(),
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { forwardRef, Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { MulterModule } from '@nestjs/platform-express';
import { postsMulterOption } from 'src/util/multer';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [
    MulterModule.register(postsMulterOption),
    PrismaModule,
    TagModule,
    forwardRef(() => UserModule),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}

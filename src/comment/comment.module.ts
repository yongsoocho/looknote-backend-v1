import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './service/comment.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TagController } from './controller/tag.controller';
import { TagService } from './service/tag.service';
import { MulterModule } from '@nestjs/platform-express';
import { tagsMulterOption } from 'src/util/multer';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MulterModule.register(tagsMulterOption),
    PrismaModule,
    forwardRef(() => UserModule),
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}

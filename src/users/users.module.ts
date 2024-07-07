import {
  BadRequestException,
  Module,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { USER_PROFILE_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    MulterModule.register({
      limits: {
        fileSize: 10000000,
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);

        if (
          ext !== '.jpg' &&
          ext !== '.jpeg' &&
          ext !== '.png'
        ) {
          return cb(
            new BadRequestException(
              'jpg, jpeg, png 파일만 업로드 가능합니다.',
            ),
            false,
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, cb) {
          cb(null, USER_PROFILE_IMAGE_PATH);
        },
        filename: function (req, file, cb) {
          cb(
            null,
            `${uuid()}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

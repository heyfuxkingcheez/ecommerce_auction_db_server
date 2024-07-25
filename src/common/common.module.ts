import {
  BadRequestException,
  Module,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModel } from './entities/image.entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'wook',
    }),
    TypeOrmModule.forFeature([ImageModel]),
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
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          cb(
            null,
            `${uuid()}${extname(file.originalname)}`,
          );
        },
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}

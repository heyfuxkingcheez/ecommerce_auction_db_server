import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ImageModel } from 'src/common/entities/image.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateItemImageDto } from './dto/create-image.dto';
import {
  ITEM_IMAGE_PATH,
  TEMP_FOLDER_PATH,
} from 'src/common/const/path.const';
import { basename, join } from 'path';
import { promises } from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  async createItemImage(
    dto: CreateItemImageDto,
    qr?: QueryRunner,
  ) {
    const repo = this.getRepository(qr);

    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempFilePath);
    } catch (error) {
      throw new BadRequestException(
        '존재하지 않는 파일 입니다.',
      );
    }

    const fileName = basename(tempFilePath);

    const newPath = join(ITEM_IMAGE_PATH, fileName);

    const existImages = await repo.findOne({
      where: {
        order: dto.order,
        item: {
          id: dto.item.id,
        },
      },
    });

    if (existImages) {
      existImages.order = dto.order;
      existImages.path = dto.path;
      existImages.type = dto.type;
    }

    const result = await repo.save(existImages);

    await promises.rename(tempFilePath, newPath);

    return result;
  }
}

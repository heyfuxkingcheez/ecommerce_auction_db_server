import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagModel } from './entities/tag.entity';
import { QueryRunner, Repository } from 'typeorm';
import { TagItemModel } from './entities/tag-item.entity';
import { TagDto } from './dto/tag.dto';
import { TagItemDto } from './dto/tag-item.dto';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
    @InjectRepository(TagItemModel)
    private readonly tagItemRepository: Repository<TagItemModel>,
    private readonly itemsService: ItemsService,
  ) {}
  getTagRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<TagModel>(TagModel)
      : this.tagRepository;
  }

  getTagItemRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<TagItemModel>(TagItemModel)
      : this.tagItemRepository;
  }

  async postTag(dto: TagDto, qr?: QueryRunner) {
    const repo = this.getTagRepository(qr);

    const isExistTag = await repo.findOne({
      where: {
        tag: dto.tag,
      },
    });

    if (isExistTag)
      throw new BadRequestException(
        '이미 등록된 테그입니다.',
      );

    const newTag = repo.create({
      tag: dto.tag,
    });

    return await repo.save(newTag);
  }

  async postTagItem(dto: TagItemDto, qr?: QueryRunner) {
    const tagItemRepo = this.getTagItemRepository(qr);
    const tagRepo = this.getTagRepository(qr);

    const tag = await tagRepo.findOne({
      where: { id: dto.tagId },
    });
    const item = await this.itemsService.getItemByItemId(
      dto.itemId,
      qr,
    );

    const isExistTagItem = await tagItemRepo.findOne({
      where: {
        tag: {
          id: tag.id,
        },
        item: {
          id: item.id,
        },
      },
    });

    if (isExistTagItem) {
      throw new BadRequestException(
        '이미 등록된 테그-아이템 입니다.',
      );
    }

    const newTagItem = tagItemRepo.create({
      tag,
      item,
    });

    return await tagItemRepo.save(newTagItem);
  }

  async getTagsHaveItems(tagName: string) {
    const items = await this.tagItemRepository
      .createQueryBuilder('tagItem')
      .leftJoinAndSelect('tagItem.tag', 'tag')
      .leftJoinAndSelect('tagItem.item', 'item')
      .leftJoinAndSelect('item.images', 'image')
      .where('tag.tag = :tagName', { tagName })
      .orderBy('item.id', 'DESC')
      .getMany();

    const result = items.map((tagItem) => {
      const item = tagItem.item;
      return {
        id: item.id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        item_name_kr: item.item_name_kr,
        item_name_en: item.item_name_en,
        model_number: item.model_number,
        release_price: item.release_price,
        release_date: item.release_date,
        images: item.images.map((image) => ({
          id: image.id,
          created_at: image.created_at,
          updated_at: image.updated_at,
          order: image.order,
          type: image.type,
          path: `public/items/${image.path}`,
        })),
      };
    });

    return result;
  }
}

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemModel } from './entities/item.entity';
import {
  FindOptionsWhere,
  LessThan,
  MoreThan,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginateItemDto } from './dto/paginate-item.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemModel)
    private readonly itemRepository: Repository<ItemModel>,
    private readonly configService: ConfigService,
  ) {}
  // 오름차 순으로 정렬하는 페이지네이션만 구현
  async paginateItems(dto: PaginateItemDto) {
    if (dto.page) {
      return this.pagePaginateItems(dto);
    } else {
      return this.cursorPaginateItems(dto);
    }
  }

  async pagePaginateItems(dto: PaginateItemDto) {
    const [items, count] =
      await this.itemRepository.findAndCount({
        skip: dto.take * (dto.page - 1),
        take: dto.take,
        order: {
          created_at: dto.order__createdAt,
        },
      });

    return {
      data: items,
      total: count,
    };
  }

  async cursorPaginateItems(dto: PaginateItemDto) {
    const where: FindOptionsWhere<ItemModel> = {};

    if (dto.where__itemNumber_less_than) {
      where.item_number = LessThan(
        dto.where__itemNumber_less_than,
      );
    } else if (dto.where__itemNumber_more_than) {
      where.item_number = MoreThan(
        dto.where__itemNumber_more_than,
      );
    }

    const items = await this.itemRepository.find({
      where,
      order: {
        created_at: dto.order__createdAt,
      },
      take: dto.take,
    });

    const lastItem =
      items.length > 0 && items.length === dto.take
        ? items[items.length - 1]
        : null;

    const nextUrl =
      lastItem &&
      new URL(
        `${this.configService.get<string>('URL')}/items`,
      );

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__itemNumber_more_than' &&
            key !== 'where__itemNumber_less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__itemNumber_more_than';
      } else {
        key = 'where__itemNumber_less_than';
      }

      nextUrl.searchParams.append(
        key,
        lastItem.item_number.toString(),
      );
    }

    return {
      data: items,
      cursor: {
        after: lastItem?.item_number ?? null,
      },
      count: items.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  async generateItems() {
    for (let i = 0; i < 100; i++) {}
  }

  async getAllItems() {
    return await this.itemRepository.find();
  }

  async postItem(
    dto: CreateItemDto,
    qr?: QueryRunner,
  ): Promise<ItemModel> {
    const repo = this.getRepository(qr);
    try {
      const existItem = await this.existItemBymodelNumber(
        dto.model_number,
      );

      if (existItem)
        throw new BadRequestException(
          '이미 등록된 상품 입니다.',
        );

      const newItem = repo.create({
        ...dto,
        images: [],
      });

      return await repo.save(newItem);
    } catch (error) {
      console.log(error);
    }
  }

  async existItemBymodelNumber(modelNumber: string) {
    return await this.itemRepository.exists({
      where: {
        model_number: modelNumber,
      },
    });
  }

  async getItemByItemId(itemId: string, qr?: QueryRunner) {
    const repo = this.getRepository(qr);

    const item = await repo.findOne({
      where: {
        id: itemId,
      },
    });

    if (!item)
      throw new BadRequestException(
        '존재하지 않는 상품 입니다.',
      );

    return item;
  }

  async patchItem(
    itemId: string,
    dto: UpdateItemDto,
    qr?: QueryRunner,
  ): Promise<ItemModel> {
    const repo = this.getRepository(qr);

    const item = await this.getItemByItemId(itemId);

    if (dto.item_name_en)
      item.item_name_en = dto.item_name_en;
    if (dto.item_name_kr)
      item.item_name_kr = dto.item_name_kr;
    if (dto.model_number)
      item.model_number = dto.model_number;
    if (dto.release_date)
      item.release_date = dto.release_date;
    if (dto.release_price)
      item.release_price = dto.release_price;

    // return this.itemRepository.update({ id: itemId }, item);

    return await repo.save(item);
  }

  async deleteItem(itemId: string) {
    await this.getItemByItemId(itemId);

    return await this.itemRepository.delete({ id: itemId });
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ItemModel>(ItemModel)
      : this.itemRepository;
  }
}

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemModel } from './entities/item.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginateItemDto } from './dto/paginate-item.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemModel)
    private readonly itemRepository: Repository<ItemModel>,
    private readonly commonService: CommonService,
  ) {}
  async paginateItems(dto: PaginateItemDto) {
    return this.commonService.paginate(
      dto,
      this.itemRepository,
      {
        relations: ['images'],
      },
      'items',
    );
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

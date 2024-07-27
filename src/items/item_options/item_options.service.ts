import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ItemOptionModel } from './entities/item-option.entitiy';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemOptionDto } from './dto/create-item_option.dto';
import { UpdateItemOptionDto } from './dto/update-item_option.dto';
import { ItemOptionEnum } from '../const/itemOpion.const';

@Injectable()
export class ItemOptionsService {
  constructor(
    @InjectRepository(ItemOptionModel)
    private readonly itemOptionRepository: Repository<ItemOptionModel>,
  ) {}

  async postItemOption(
    dto: CreateItemOptionDto,
    itemId: string,
  ): Promise<ItemOptionModel> {
    const existItemOption =
      await this.existsItemOptionByOption(dto.option);

    if (existItemOption)
      throw new BadRequestException(
        '이미 존재하는 옵션 입니다.',
      );

    const itemOption = this.itemOptionRepository.create({
      option: dto.option,
      item: {
        id: itemId,
      },
    });

    return await this.itemOptionRepository.save(itemOption);
  }

  async patchItemOption(
    dto: UpdateItemOptionDto,
    itemOptionId: string,
  ): Promise<ItemOptionModel> {
    const existItemOption =
      await this.existsItemOptionByOption(dto.option);

    if (existItemOption)
      throw new BadRequestException(
        '이미 존재하는 옵션 입니다.',
      );

    const itemOption =
      await this.getItemOpionByItemOptionId(itemOptionId);

    await this.itemOptionRepository.update(
      { id: itemOption.id },
      dto,
    );

    return await this.getItemOpionByItemOptionId(
      itemOptionId,
    );
  }

  async deleteItemOption(itemOpionId: string) {
    await this.getItemOpionByItemOptionId(itemOpionId);

    return await this.itemOptionRepository.delete({
      id: itemOpionId,
    });
  }

  async getItemOpionByItemOptionId(
    itemOptionId: string,
  ): Promise<ItemOptionModel> {
    const itemOption =
      await this.itemOptionRepository.findOne({
        where: {
          id: itemOptionId,
        },
      });

    if (!itemOption)
      throw new NotFoundException(
        '존재하지 않는 옵션 입니다.',
      );

    return itemOption;
  }

  async getItemOptionsByItemId(
    itemId: string,
  ): Promise<ItemOptionModel[]> {
    return await this.itemOptionRepository.find({
      where: {
        item: {
          id: itemId,
        },
      },
      relations: ['item'],
    });
  }

  async existsItemOptionByOption(
    option: ItemOptionEnum,
  ): Promise<boolean> {
    const existsItemOption =
      await this.itemOptionRepository.exists({
        where: {
          option,
        },
      });

    return existsItemOption;
  }
}

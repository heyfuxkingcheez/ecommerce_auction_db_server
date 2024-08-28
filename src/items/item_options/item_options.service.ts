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
import { ItemModel } from '../entities/item.entity';
import { BiddingStatusEnum } from 'src/auctions/const/bidding-status.const';

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
      await this.findItemOptionByOption(dto.option, itemId);

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
    itemId: string,
  ): Promise<ItemOptionModel> {
    const existItemOption =
      await this.findItemOptionByOption(dto.option, itemId);

    if (existItemOption)
      throw new BadRequestException(
        '이미 존재하는 옵션 입니다.',
      );

    const itemOption =
      await this.getItemOpionByItemOptionId(
        existItemOption.id,
      );

    await this.itemOptionRepository.update(
      { id: itemOption.id },
      dto,
    );

    return await this.getItemOpionByItemOptionId(
      existItemOption.id,
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

  async getItemOptionWithItemAndImagesByItemOptionId(
    itemOptionId: string,
  ) {
    const itemOption = await this.itemOptionRepository
      .createQueryBuilder('itemOption')
      .leftJoinAndSelect('itemOption.item', 'item')
      .leftJoinAndSelect('item.images', 'images')
      .where('itemOption.id = :itemOptionId', {
        itemOptionId,
      })
      .getOne();

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

  async findItemOptionByOption(
    option: ItemOptionEnum,
    itemId: string,
  ): Promise<ItemOptionModel> {
    const existsItemOption =
      await this.itemOptionRepository.findOne({
        where: {
          option,
          item: {
            id: itemId,
          },
        },
      });

    return existsItemOption;
  }

  async getPurchaseBiddingLowestPriceByItemOption(
    itemOptionId: string,
  ) {
    const itemOption = await this.itemOptionRepository
      .createQueryBuilder('itemOption')
      .leftJoinAndSelect(
        'itemOption.purchaseBidding',
        'purchaseBidding',
      )
      .where('itemOption.id = :itemOptionId', {
        itemOptionId,
      })
      .andWhere('purchaseBidding.status = :status', {
        status: BiddingStatusEnum.ONGOING,
      })
      .orderBy('purchaseBidding.price', 'ASC')
      .limit(1) // price가 가장 낮은 하나만 가져오기 위해 제한
      .getOne();

    return itemOption;
  }

  async getSaleBiddingLowestPriceByItemOption(
    itemOptionId: string,
  ) {
    const itemOption = await this.itemOptionRepository
      .createQueryBuilder('itemOption')
      .leftJoinAndSelect('itemOption.item', 'item')
      .leftJoinAndSelect('item.images', 'images')
      .leftJoinAndSelect(
        'itemOption.saleBidding',
        'saleBidding',
      )
      .where('itemOption.id = :itemOptionId', {
        itemOptionId,
      })
      .andWhere('saleBidding.status = :status', {
        status: BiddingStatusEnum.ONGOING,
      })
      .orderBy('saleBidding.price', 'ASC')
      .limit(1) // price가 가장 낮은 하나만 가져오기 위해 제한
      .getOne();

    console.log(itemOption);

    return itemOption;
  }
}

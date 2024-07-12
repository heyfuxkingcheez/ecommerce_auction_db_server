import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CommonService } from './../common/common.service';
import { ImagesService } from './images/images.service';
import { ImageModelType } from 'src/common/entities/image.entity';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly imagesService: ImagesService,
  ) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @UseInterceptors(TransactionInterceptor)
  async postItem(
    @Body() dto: CreateItemDto,
    @QueryRunner() qr?: QR,
  ) {
    const item = await this.itemsService.postItem(dto, qr);

    for (let i = 0; i < dto.images.length; i++) {
      await this.imagesService.createItemImage(
        {
          item,
          order: i,
          path: dto.images[i],
          type: ImageModelType.ITEM_IMAGE,
        },
        qr,
      );
    }

    return this.itemsService.getItemByItemId(item.id, qr);
  }

  @Patch(':itemId')
  @Roles(RolesEnum.ADMIN)
  @UseInterceptors(TransactionInterceptor)
  async patchItem(
    @Body() dto: UpdateItemDto,
    @Param('itemId') itemId: string,
    @QueryRunner() qr: QR,
  ) {
    const item = await this.itemsService.patchItem(
      itemId,
      dto,
      qr,
    );

    for (let i = 0; i < dto.images.length; i++) {
      await this.imagesService.createItemImage(
        {
          item,
          order: i,
          path: dto.images[i],
          type: ImageModelType.ITEM_IMAGE,
        },
        qr,
      );
    }

    return this.itemsService.getItemByItemId(itemId, qr);
  }

  @Delete(':itemId')
  @Roles(RolesEnum.ADMIN)
  async deleteItem(@Param('itemId') itemId: string) {
    return await this.itemsService.deleteItem(itemId);
  }

  @Get()
  async getItems() {}
}

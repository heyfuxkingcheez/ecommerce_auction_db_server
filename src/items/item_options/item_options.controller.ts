import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemOptionsService } from './item_options.service';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const';

import { User } from 'src/users/decorator/user.decorator';
import { CreateItemOptionDto } from './dto/create-item_option.dto';
import { UpdateItemOptionDto } from './dto/update-item_option.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('items/:itemId/item-options')
export class ItemOptionsController {
  constructor(
    private readonly itemOptionsService: ItemOptionsService,
  ) {}

  @Get()
  @IsPublic()
  async getItemOptionsByItemId(
    @Param('itemId') itemId: string,
  ) {
    return await this.itemOptionsService.getItemOptionsByItemId(
      itemId,
    );
  }

  @Post()
  @Roles(RolesEnum.ADMIN)
  async postItemOpiton(
    @User('id') userId: string,
    @Body() dto: CreateItemOptionDto,
    @Param('itemId') itemId: string,
  ) {
    return await this.itemOptionsService.postItemOption(
      dto,
      itemId,
    );
  }

  @Patch('/:itemOptionId')
  @Roles(RolesEnum.ADMIN)
  async patchItemOption(
    @Body() dto: UpdateItemOptionDto,
    @Param('itemOpitonId') itemOpitonId: string,
  ) {
    return await this.itemOptionsService.patchItemOption(
      dto,
      itemOpitonId,
    );
  }

  @Delete('/:itemOptionId')
  @Roles(RolesEnum.ADMIN)
  async deleteItemOpion(
    @Param('itemOpionId') itemOptionId: string,
  ) {
    return await this.itemOptionsService.deleteItemOption(
      itemOptionId,
    );
  }
}

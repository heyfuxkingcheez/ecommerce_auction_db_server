import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
  ) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  async postItem(@Body() dto: CreateItemDto) {
    console.log(dto);
    return await this.itemsService.postItem(dto);
  }

  @Patch(':itemId')
  @Roles(RolesEnum.ADMIN)
  async patchItem(
    @Body() dto: UpdateItemDto,
    @Param('itemId') itemId: string,
  ) {
    return await this.itemsService.patchItem(itemId, dto);
  }

  @Delete(':itemId')
  @Roles(RolesEnum.ADMIN)
  async deleteItem(@Param('itemId') itemId: string) {
    return await this.itemsService.deleteItem(itemId);
  }

  @Get()
  async getItems() {}
}

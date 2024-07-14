import { PickType } from '@nestjs/mapped-types';
import { ItemModel } from '../entities/item.entity';
import {
  ArrayMaxSize,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateItemDto extends PickType(ItemModel, [
  'item_name_kr',
  'item_name_en',
  'model_number',
  'release_date',
  'release_price',
]) {
  @IsString({
    each: true,
  })
  @IsOptional()
  @ArrayMaxSize(3)
  images: string[];
}

import { PickType } from '@nestjs/mapped-types';
import { ItemModel } from '../entities/item.entity';

export class CreateItemDto extends PickType(ItemModel, [
  'item_name_kr',
  'item_name_en',
  'model_number',
  'release_date',
  'release_price',
]) {}

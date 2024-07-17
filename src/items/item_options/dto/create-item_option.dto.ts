import { PickType } from '@nestjs/mapped-types';
import { ItemOptionModel } from '../entities/item-option.entitiy';

export class CreateItemOptionDto extends PickType(
  ItemOptionModel,
  ['item', 'option'],
) {}

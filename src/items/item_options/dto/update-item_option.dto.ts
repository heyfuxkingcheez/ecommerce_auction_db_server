import { PickType } from '@nestjs/mapped-types';
import { ItemOptionModel } from '../entities/item-option.entitiy';

export class UpdateItemOptionDto extends PickType(
  ItemOptionModel,
  ['option'],
) {}

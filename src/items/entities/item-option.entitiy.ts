import { BaseModel } from 'src/common/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ItemModel } from './item.entity';
import { ItemOptionEnum } from '../const/itemOpion.const';
import { IsEnum } from 'class-validator';

@Entity()
export class ItemOptionModel extends BaseModel {
  @Column()
  @IsEnum(ItemOptionEnum)
  option: ItemOptionEnum;

  @ManyToOne(
    (type) => ItemModel,
    (item) => item.itemOptions,
  )
  item: ItemModel;
}

import { BaseModel } from 'src/common/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum } from 'class-validator';
import { ItemOptionEnum } from 'src/items/const/itemOpion.const';
import { ItemModel } from 'src/items/entities/item.entity';

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

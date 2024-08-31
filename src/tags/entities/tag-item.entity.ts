import { Entity, ManyToOne } from 'typeorm';
import { ItemModel } from 'src/items/entities/item.entity';
import { TagModel } from './tag.entity';
import { BaseModel } from 'src/common/entities';

@Entity()
export class TagItemModel extends BaseModel {
  @ManyToOne(() => TagModel, (tag) => tag.tagItem)
  tag: TagModel;

  @ManyToOne(() => ItemModel, (item) => item.tagItem)
  item: ItemModel;
}

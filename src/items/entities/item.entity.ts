import {
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { ImageModel } from 'src/common/entities/image.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ItemOptionModel } from '../item_options/entities/item-option.entitiy';

@Entity()
export class ItemModel extends BaseModel {
  @Column()
  @IsString()
  item_name_kr: string;

  @Column()
  @IsString()
  item_name_en: string;

  @Column()
  @IsString()
  model_number: string;

  @Column()
  @IsNumber()
  release_price: number;

  @Column({
    type: 'date',
  })
  @IsDate()
  release_date: Date;

  @OneToMany((type) => ImageModel, (image) => image.item)
  images: ImageModel[];

  @OneToMany(
    (type) => ItemOptionModel,
    (itemOption) => itemOption.item,
  )
  itemOptions: ItemOptionModel[];
}

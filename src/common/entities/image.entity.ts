import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ITEM_IMAGE_PATH } from '../const/path.const';
import { join } from 'path';
import { ItemModel } from 'src/items/entities/item.entity';

export enum ImageModelType {
  ITEM_IMAGE,
}

@Entity()
export class ImageModel extends BaseModel {
  @Column({
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  order: number;

  @Column({
    enum: ImageModelType,
  })
  @IsEnum(ImageModelType)
  @IsString()
  type: ImageModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageModelType.ITEM_IMAGE) {
      return join(ITEM_IMAGE_PATH, value);
    } else {
      return value;
    }
  })
  path: string;

  @ManyToOne((type) => ItemModel, (item) => item.images)
  item?: ItemModel;
}

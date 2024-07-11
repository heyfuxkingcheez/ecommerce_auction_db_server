import {
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { Column, Entity } from 'typeorm';

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
}

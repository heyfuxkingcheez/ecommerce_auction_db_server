import { Column, Entity, OneToMany } from 'typeorm';
import { TagItemModel } from './tag-item.entity';
import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities';

@Entity()
export class TagModel extends BaseModel {
  @Column({ nullable: false })
  @IsString()
  tag: string;

  @OneToMany(() => TagItemModel, (tagItem) => tagItem.tag)
  tagItem: TagItemModel[];
}

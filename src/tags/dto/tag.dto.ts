import { PickType } from '@nestjs/mapped-types';
import { TagModel } from '../entities/tag.entity';

export class TagDto extends PickType(TagModel, ['tag']) {}

import { PickType } from '@nestjs/mapped-types';
import { ImageModel } from 'src/common/entities/image.entity';

export class CreateItemImageDto extends PickType(
  ImageModel,
  ['order', 'item', 'path', 'type'],
) {}

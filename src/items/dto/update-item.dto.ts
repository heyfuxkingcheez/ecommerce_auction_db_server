import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto extends PartialType(
  CreateItemDto,
) {
  @IsString({
    each: true,
  })
  @IsOptional()
  images: string[];
}

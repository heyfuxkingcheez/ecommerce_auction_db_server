import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import {
  ArrayMaxSize,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateItemDto extends PartialType(
  CreateItemDto,
) {}

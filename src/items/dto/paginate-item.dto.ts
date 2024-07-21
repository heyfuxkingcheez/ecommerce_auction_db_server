import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

export class PaginateItemDto extends BasePaginationDto {
  @IsString()
  @IsOptional()
  where__item_name_kr__i_like: string;
}

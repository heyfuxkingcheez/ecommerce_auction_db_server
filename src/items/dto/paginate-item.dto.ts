import {
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class PaginateItemDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  where__itemNumber_more_than?: number;

  @IsNumber()
  @IsOptional()
  where__itemNumber_less_than?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 2;
}

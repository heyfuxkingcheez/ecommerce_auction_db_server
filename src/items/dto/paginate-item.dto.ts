import {
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class PaginateItemDto {
  @IsNumber()
  @IsOptional()
  where__itemNumber_more_than?: number;

  @IsIn(['ASC'])
  @IsOptional()
  order__createdAt: 'ASC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 2;
}

import {
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  where__itemNumber__more_than?: string;

  @IsNumber()
  @IsOptional()
  where__itemNumber__less_than?: string;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 2;
}

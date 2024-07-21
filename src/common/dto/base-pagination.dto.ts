import {
  IsIn,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsUUID()
  @IsOptional()
  where__id__more_than?: string;

  @IsUUID()
  @IsOptional()
  where__id__less_than?: string;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__created_at: 'ASC' | 'DESC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 20;
}

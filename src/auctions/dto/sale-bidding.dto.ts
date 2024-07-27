import { PickType } from '@nestjs/mapped-types';
import { SaleBiddingModel } from '../entities/sale-bidding.entity';
import { IsString } from 'class-validator';

export class SaleBiddingDto extends PickType(
  SaleBiddingModel,
  ['price', 'expired_date'],
) {
  @IsString()
  itemOptionId: string;
}

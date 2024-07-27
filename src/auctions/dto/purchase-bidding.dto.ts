import { PickType } from '@nestjs/mapped-types';
import { PurchaseBiddingModel } from '../entities/purchase-bidding.entity';
import { IsString } from 'class-validator';

export class PurchaseBiddingDto extends PickType(
  PurchaseBiddingModel,
  ['delivery_instruction', 'expired_date', 'price'],
) {
  @IsString()
  itemOptionId: string;

  @IsString()
  paymentId: string;

  @IsString()
  addressId: string;
}

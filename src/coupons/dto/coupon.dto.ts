import { PickType } from '@nestjs/mapped-types';
import { CouponModel } from '../entities/coupon.entity';
import { IsNumber } from 'class-validator';

export class CouponDto extends PickType(CouponModel, [
  'coupon_name',
  'discount_rate',
  'issued_at',
  'expired_at',
]) {
  @IsNumber()
  count: number;
}

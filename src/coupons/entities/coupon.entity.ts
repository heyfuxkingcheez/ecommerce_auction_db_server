import { BaseModel } from 'src/common/entities';
import {
  Column,
  Entity,
  OneToMany,
  Timestamp,
} from 'typeorm';
import { CouponStatusEnum } from '../const/coupon_status.const';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { UserCouponModel } from './user-coupon.entity';

@Entity()
export class CouponModel extends BaseModel {
  @IsString()
  @Column()
  coupon_name: string;

  @IsNumber()
  @Column()
  discount_rate: number;

  @IsDate()
  @Column({ type: 'timestamp' })
  issued_at: Timestamp;

  @IsDate()
  @Column({ type: 'timestamp' })
  expired_at: Timestamp;

  @IsEnum(CouponStatusEnum)
  @Column({ default: CouponStatusEnum.PENDING })
  status: CouponStatusEnum;

  @OneToMany(
    () => UserCouponModel,
    (userCoupon) => userCoupon.coupon,
  )
  user_coupon: UserCouponModel[];
}

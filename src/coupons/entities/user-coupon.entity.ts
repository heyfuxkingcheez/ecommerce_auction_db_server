import { BaseModel } from 'src/common/entities';
import { UserModel } from 'src/users/entities';
import { Entity, ManyToMany, ManyToOne } from 'typeorm';
import { CouponModel } from './coupon.entity';

@Entity()
export class UserCouponModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.user_coupon)
  user: UserModel;

  @ManyToOne(
    () => CouponModel,
    (coupon) => coupon.user_coupon,
  )
  coupon: CouponModel;
}

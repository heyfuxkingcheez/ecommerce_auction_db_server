import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponModel } from './entities/coupon.entity';
import { UserCouponModel } from './entities/user-coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CouponModel,
      UserCouponModel,
    ]),
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}

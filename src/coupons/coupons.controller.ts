import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const';
import { CouponDto } from './dto/coupon.dto';
import { User } from 'src/users/decorator/user.decorator';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('coupons')
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
  ) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @Roles(RolesEnum.ADMIN)
  async postCoupon(
    @Body() dto: CouponDto,
    @QueryRunner() qr: QR,
  ) {
    await this.couponsService.postCoupon(dto, qr);

    return { STATUS_CODES: 200, MESSAGE: '쿠폰 등록 완료' };
  }

  @Get()
  @IsPublic()
  async getCoupons() {
    return await this.couponsService.getCoupons();
  }

  @Get('me')
  async getUserCoupons(@User('id') userId: string) {
    return await this.couponsService.getUserCoupons(userId);
  }

  @Get('issue')
  @UseInterceptors(TransactionInterceptor)
  async requestCoupon(
    @User('id') userId: string,
    @Query('coupon-name') couponName: string,
    @QueryRunner() qr: QR,
  ) {
    return await this.couponsService.requestCoupon(
      couponName,
      userId,
      qr,
    );
  }
}

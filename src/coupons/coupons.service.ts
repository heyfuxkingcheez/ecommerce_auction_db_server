import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponModel } from './entities/coupon.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UserCouponModel } from './entities/user-coupon.entity';
import { CouponDto } from './dto/coupon.dto';
import { CouponStatusEnum } from './const/coupon_status.const';
import Redlock from 'redlock';
import { STATUS_CODES } from 'http';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponModel)
    private readonly couponRepository: Repository<CouponModel>,
    @InjectRepository(UserCouponModel)
    private readonly userCouponRepository: Repository<UserCouponModel>,
    @Inject('Redlock') private readonly redlock: Redlock,
  ) {}

  getCouponRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<CouponModel>(CouponModel)
      : this.couponRepository;
  }

  getUserCouponRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UserCouponModel>(
          UserCouponModel,
        )
      : this.userCouponRepository;
  }

  async postCoupon(dto: CouponDto, qr?: QueryRunner) {
    const couponRepo = this.getCouponRepository(qr);
    const { count, ...postDto } = dto;

    const coupons = [];

    for (let i = 0; i < count; i++) {
      const coupon = couponRepo.create({
        ...postDto,
      });
      coupons.push(coupon);
    }

    return await couponRepo.save(coupons);
  }

  async requestCoupon(
    couponName: string,
    userId: string,
    qr?: QueryRunner,
  ) {
    const couponRepo = this.getCouponRepository(qr);
    const userCouponRepo = this.getUserCouponRepository(qr);

    try {
      const validCoupon = await couponRepo.findOne({
        where: {
          coupon_name: couponName,
          status: CouponStatusEnum.PENDING,
        },
        lock: { mode: 'pessimistic_write' },
        select: ['id', 'issued_at'],
      });

      if (!validCoupon)
        throw new BadRequestException(
          `쿠폰이 모두 소진되었습니다.`,
        );

      if (validCoupon.issued_at > new Date()) {
        throw new BadRequestException(
          `본 쿠폰은 ${validCoupon.issued_at}부터 발급 가능합니다.`,
        );
      }

      const isIssuedCouponToUser = await userCouponRepo
        .createQueryBuilder('user_coupon')
        .innerJoinAndSelect('user_coupon.coupon', 'coupon')
        .where('user_coupon.userId = :userId', { userId })
        .andWhere('coupon.coupon_name = :couponName', {
          couponName,
        })
        .getOne();

      if (isIssuedCouponToUser) {
        throw new BadRequestException(
          '이미 발급받은 쿠폰 입니다.',
        );
      }

      const userCoupon = userCouponRepo.create({
        user: {
          id: userId,
        },
        coupon: {
          id: validCoupon.id,
        },
      });
      Promise.all([
        couponRepo.update(validCoupon.id, {
          status: CouponStatusEnum.ISSUED,
        }),
        userCouponRepo.save(userCoupon),
      ]);

      return { STATUS_CODES: 200, MESSAGE: '발급 완료' };
    } catch (error) {
      throw error;
    }
  }

  async getCoupons(qr?: QueryRunner) {
    const repo = this.getCouponRepository(qr);

    const coupons = await repo
      .createQueryBuilder('coupon')
      .select('coupon.coupon_name')
      .addSelect('coupon.issued_at')
      .addSelect('coupon.discount_rate')
      .addSelect('COUNT(coupon.id)', 'count')
      .where('coupon.status = :status', {
        status: CouponStatusEnum.PENDING,
      })
      .groupBy('coupon.coupon_name')
      .addGroupBy('coupon.issued_at')
      .addGroupBy('coupon.discount_rate')
      .getRawMany();

    return coupons;
  }

  async getUserCoupons(userId: string) {
    const userCoupons =
      await this.userCouponRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['coupon'],
      });

    return userCoupons;
  }
}

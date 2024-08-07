import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseBiddingModel } from './entities/purchase-bidding.entity';
import {
  MoreThan,
  QueryRunner,
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { ItemOptionsService } from 'src/items/item_options/item_options.service';
import { PaymentsService } from './../payments/payment.service';
import { AddressBooksService } from 'src/users/address-books/address-books.service';
import { PurchaseBiddingDto } from './dto/purchase-bidding.dto';
import { SaleBiddingDto } from './dto/sale-bidding.dto';
import { SaleBiddingModel } from './entities/sale-bidding.entity';
import { BiddingStatusEnum } from './const/bidding-status.const';
import { BidExecutionModel } from './entities/bid-execution.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import Redlock, { Lock } from 'redlock';

@Injectable()
export class AuctionsService {
  constructor(
    // 의존성이 많은 상황 나중에 리팩토링 해보자.
    @InjectRepository(PurchaseBiddingModel)
    private readonly purchaseBiddingRepository: Repository<PurchaseBiddingModel>,
    @InjectRepository(SaleBiddingModel)
    private readonly saleBiddingRepository: Repository<SaleBiddingModel>,
    @InjectRepository(BidExecutionModel)
    private readonly bidExecutionRepository: Repository<BidExecutionModel>,
    @InjectQueue('auction')
    private readonly auctionQueue: Queue,
    @InjectQueue('payment')
    private readonly reqBillingKey: Queue,
    private readonly itemOptionService: ItemOptionsService,
    private readonly paymentsService: PaymentsService,
    private readonly addressBooksService: AddressBooksService,
    @Inject('Redlock') private readonly redlock: Redlock,
  ) {
    this.auctionQueue.on('error', (error) => {
      console.error('Queue error:', error);
    });
  }

  getPurchaseBiddingRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<PurchaseBiddingModel>(
          PurchaseBiddingModel,
        )
      : this.purchaseBiddingRepository;
  }
  getSaleBiddingRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<SaleBiddingModel>(
          SaleBiddingModel,
        )
      : this.saleBiddingRepository;
  }
  getBidExecutionRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<BidExecutionModel>(
          BidExecutionModel,
        )
      : this.bidExecutionRepository;
  }

  async getPurchaseBiddingById(purchaseBiddingId: string) {
    const purchaseBid =
      await this.purchaseBiddingRepository.findOne({
        where: {
          id: purchaseBiddingId,
        },
        relations: ['payment', 'user'],
      });

    if (!purchaseBid.payment)
      throw new NotFoundException(
        '등록된 결제 정보가 없습니다.',
      );

    return purchaseBid;
  }

  async postPurchaseBidding(
    userId: string,
    dto: PurchaseBiddingDto,
    qr?: QueryRunner,
  ) {
    const repo = this.getPurchaseBiddingRepository(qr);

    try {
      await this.itemOptionService.getItemOpionByItemOptionId(
        dto.itemOptionId,
      );

      await this.paymentsService.getBillingKeyById(
        dto.paymentId,
        dto.payment_password,
      );

      await this.addressBooksService.getAddressById(
        dto.addressId,
        userId,
      );

      const purchaseBid = repo.create({
        user: {
          id: userId,
        },
        payment: {
          id: dto.paymentId,
        },
        address: {
          id: dto.addressId,
        },
        itemOption: {
          id: dto.itemOptionId,
        },
        expired_date: dto.expired_date,
        price: dto.price,
        delivery_instruction: dto.delivery_instruction,
      });

      await repo.save(purchaseBid);

      await this.findMatchingBids(
        dto.itemOptionId,
        dto.price,
        qr,
      );
    } catch (error) {
      throw error;
    }
  }

  async postSaleBidding(
    userId: string,
    dto: SaleBiddingDto,
    qr?: QueryRunner,
  ) {
    const repo = this.getSaleBiddingRepository(qr);
    try {
      await this.itemOptionService.getItemOpionByItemOptionId(
        dto.itemOptionId,
      );

      const saleBid = repo.create({
        user: {
          id: userId,
        },
        itemOption: {
          id: dto.itemOptionId,
        },
        expired_date: dto.expired_date,
        price: dto.price,
      });

      await repo.save(saleBid);

      await this.findMatchingBids(
        dto.itemOptionId,
        dto.price,
        qr,
      );
    } catch (error) {
      throw error;
    }
  }

  // private async isMatchingBids(
  //   itemOptionId: string,
  //   price: number,
  //   purchaseBiddingId?: string,
  //   saleBiddingId?: string,
  //   qr?: QueryRunner,
  // ) {
  //   try {
  //     // return purchaseBiddingId
  //     //   ? await this.findMatchingPurchaseBid(
  //     //       itemOptionId,
  //     //       price,
  //     //       purchaseBiddingId,
  //     //       qr,
  //     //     )
  //     //   : await this.findMatchingSaleBid(
  //     //       itemOptionId,
  //     //       price,
  //     //       saleBiddingId,
  //     //       qr,
  //     //     );
  //     return this.findMatchingBids(itemOptionId, price, qr);
  //   } catch (error) {
  //     console.error(error);
  //     throw new error();
  //   }
  // }

  async findMatchingBids(
    itemOptionId: string,
    price: number,
    qr?: QueryRunner,
  ) {
    const lock = await this.redlock.acquire(
      [`${itemOptionId}`],
      2000,
    );
    try {
      const saleBid =
        await this.findBidByItemOptionAndPrice(
          itemOptionId,
          price,
          false,
          qr,
        );

      const purchaseBid =
        await this.findBidByItemOptionAndPrice(
          itemOptionId,
          price,
          true,
          qr,
        );

      if (saleBid && purchaseBid) {
        await this.updateSaleBidStatus(saleBid.id, qr);

        await this.updatePurchaseBidStatus(
          purchaseBid.id,
          qr,
        );

        await this.matchingBids(
          purchaseBid.id,
          saleBid.id,
          lock,
          qr,
        );
      }

      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async findMatchingPurchaseBid(
  //   itemOptionId: string,
  //   price: number,
  //   purchaseBiddingId: string,
  //   qr?: QueryRunner,
  // ) {
  //   try {
  //     const saleBid =
  //       await this.findBidByItemOptionAndPrice(
  //         itemOptionId,
  //         price,
  //         false,
  //         qr,
  //       );

  //     if (saleBid) {
  //       console.log(saleBid);
  //       await this.updateSaleBidStatus(saleBid.id, qr);

  //       await this.updatePurchaseBidStatus(
  //         purchaseBiddingId,
  //         qr,
  //       );

  //       // await this.matchingBids(
  //       //   purchaseBiddingId,
  //       //   saleBid.id,
  //       //   qr,
  //       // );
  //     }

  //     return;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  // async findMatchingSaleBid(
  //   itemOptionId: string,
  //   price: number,
  //   saleBiddingId: string,
  //   qr?: QueryRunner,
  // ) {
  //   try {
  //     const purchaseBid =
  //       await this.findBidByItemOptionAndPrice(
  //         itemOptionId,
  //         price,
  //         true,
  //         qr,
  //       );

  //     if (purchaseBid) {
  //       console.log(purchaseBid);
  //       await this.updatePurchaseBidStatus(
  //         purchaseBid.id,
  //         qr,
  //       );

  //       await this.updateSaleBidStatus(saleBiddingId, qr);

  //       // await this.matchingBids(
  //       //   purchaseBid.id,
  //       //   saleBiddingId,
  //       //   lock
  //       //   qr,
  //       // );
  //     }

  //     return;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  async matchingBids(
    purchaseBiddingId: string,
    saleBiddingId: string,
    lock: Lock,
    qr?: QueryRunner,
  ) {
    try {
      console.log(
        '구매',
        purchaseBiddingId,
        '판매',
        saleBiddingId,
      );
      await this.postTransaction(
        purchaseBiddingId,
        saleBiddingId,
        qr,
      );

      const billingKey = await this.getPurchaseBiddingById(
        purchaseBiddingId,
      );

      await this.reqBillingKey.add(
        'reqBillingKey',
        {
          billingKey: billingKey.payment.billing_key,
          userId: billingKey.user.id,
          price: billingKey.price,
        },
        {
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    } catch (error) {
      console.error(error);
      throw new Error('Error adding to the queue');
    } finally {
      if (lock) await lock.release();
    }
  }

  async postTransaction(
    purchaseBiddingId: string,
    saleBiddingId: string,
    qr?: QueryRunner,
  ) {
    const bidExecutionRepo =
      this.getBidExecutionRepository(qr);
    try {
      const newBidExecution = bidExecutionRepo.create({
        status: BiddingStatusEnum.ONGOING,
        saleBidding: {
          id: saleBiddingId,
        },
        purchaseBidding: {
          id: purchaseBiddingId,
        },
      });

      return await bidExecutionRepo.save(newBidExecution);
    } catch (error) {
      throw error;
    }
  }

  async updatePurchaseBidStatus(
    purchaseBiddingId: string,
    qr?: QueryRunner,
  ) {
    const purchaseRepo =
      this.getPurchaseBiddingRepository(qr);
    try {
      return await purchaseRepo.update(purchaseBiddingId, {
        status: BiddingStatusEnum.COMPLETED,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateSaleBidStatus(
    saleBiddingId: string,
    qr?: QueryRunner,
  ) {
    const saleRepo = this.getSaleBiddingRepository(qr);
    try {
      return await saleRepo.update(saleBiddingId, {
        status: BiddingStatusEnum.COMPLETED,
      });
    } catch (error) {
      throw error;
    }
  }

  async findBidByItemOptionAndPrice(
    itemOptionId: string,
    price: number,
    isPurchase: true | false,
    qr?: QueryRunner,
  ) {
    let BidRepo:
      | Repository<PurchaseBiddingModel>
      | Repository<SaleBiddingModel>;
    isPurchase
      ? (BidRepo = this.getPurchaseBiddingRepository(qr))
      : (BidRepo = this.getSaleBiddingRepository(qr));

    const bid = await BidRepo.findOne({
      where: {
        itemOption: {
          id: itemOptionId,
        },
        price: isPurchase
          ? LessThanOrEqual(price)
          : MoreThanOrEqual(price),
        expired_date: MoreThan(new Date()),
        status: BiddingStatusEnum.ONGOING,
      },
      order: {
        id: 'ASC',
        price: isPurchase ? 'DESC' : 'ASC',
      },
    });

    return bid;
  }
}

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
import { ItemsService } from 'src/items/items.service';
import { SseService } from 'src/sse/sse.service';

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
    @InjectQueue('payment')
    private readonly reqBillingKey: Queue,
    private readonly itemOptionService: ItemOptionsService,
    private readonly itemsService: ItemsService,
    private readonly paymentsService: PaymentsService,
    private readonly addressBooksService: AddressBooksService,
    @Inject('Redlock') private readonly redlock: Redlock,
    private readonly sseService: SseService,
  ) {}

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

  async getPurchaseBiddingById(
    purchaseBiddingId: string,
    qr: QueryRunner,
  ) {
    const repo = this.getPurchaseBiddingRepository(qr);

    const purchaseBid = await repo.findOne({
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

      const paymentId =
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
          id: paymentId.id,
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

      const result = await repo.save(purchaseBid);
      console.log(result);

      await this.findMatchingBids(
        result.itemOption.id,
        result.price,
        userId,
        qr,
        true,
      );

      return result;
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
        address: {
          id: dto.addressId,
        },
        expired_date: dto.expired_date,
        price: dto.price,
      });

      const result = await repo.save(saleBid);

      await this.findMatchingBids(
        dto.itemOptionId,
        dto.price,
        userId,
        qr,
        false,
      );

      return result;
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
  //     return purchaseBiddingId
  //       ? await this.findMatchingPurchaseBid(
  //           itemOptionId,
  //           price,
  //           purchaseBiddingId,
  //           qr,
  //         )
  //       : await this.findMatchingSaleBid(
  //           itemOptionId,
  //           price,
  //           saleBiddingId,
  //           qr,
  //         );
  //     // return this.findMatchingBids(itemOptionId, price, qr);
  //   } catch (error) {
  //     console.error(error);
  //     throw new error();
  //   }
  // }

  async findMatchingBids(
    itemOptionId: string,
    price: number,
    userId: string,
    qr?: QueryRunner,
    isPurchase?: boolean,
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
        if (
          isPurchase === false &&
          saleBid.price < purchaseBid.price
        ) {
          const repo = this.getSaleBiddingRepository(qr);
          await repo.update(saleBid.id, {
            price: purchaseBid.price,
          });
        } else if (
          isPurchase === true &&
          saleBid.price > purchaseBid.price
        ) {
          const repo =
            this.getPurchaseBiddingRepository(qr);
          await repo.update(purchaseBid.id, {
            price: saleBid.price,
          });
        }
        await this.updateSaleBidStatus(saleBid.id, qr);

        await this.updatePurchaseBidStatus(
          purchaseBid.id,
          qr,
        );

        this.sseService.emitEvent(
          saleBid.user.id,
          `판매 완료_${saleBid.itemOption}[${saleBid.itemOption.option}]:판매 입찰이 체결되었습니다.`,
        );

        this.sseService.emitEvent(
          purchaseBid.user.id,
          `구매 완료_${purchaseBid.itemOption}[${purchaseBid.itemOption.option}]:구매 입찰이 체결되었습니다.`,
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
        qr,
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
    isPurchase: boolean,
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
          ? MoreThanOrEqual(price)
          : LessThanOrEqual(price),
        expired_date: MoreThan(new Date()),
        status: BiddingStatusEnum.ONGOING,
      },
      order: {
        id: 'ASC',
        price: isPurchase ? 'DESC' : 'ASC',
      },
      relations: ['user', 'itemOption'],
    });

    return bid;
  }

  async getBiddingByItemId(
    itemId: string,
    isPurchase: boolean,
  ) {
    let result;
    isPurchase
      ? (result =
          await this.itemsService.getItemPurchaseBiddingLowestPrice(
            itemId,
          ))
      : (result =
          await this.itemsService.getItemSaleBiddingLowestPrice(
            itemId,
          ));

    return result;
  }

  async getUserPurchaseBiddingByUserId(
    userId: string,
    status: BiddingStatusEnum,
    qr?: QueryRunner,
  ) {
    const repo = this.getPurchaseBiddingRepository(qr);

    try {
      const bid = await repo
        .createQueryBuilder('purchaseBid')
        .leftJoinAndSelect(
          'purchaseBid.itemOption',
          'itemOption',
        )
        .leftJoinAndSelect('itemOption.item', 'item')
        .leftJoinAndSelect('item.images', 'images')
        .where('purchaseBid.user.id = :userId', { userId })
        .andWhere('purchaseBid.status = :status', {
          status,
        })
        .orderBy('purchaseBid.id', 'DESC')
        .getMany();

      return bid;
    } catch (error) {
      throw new Error(
        `입찰 내역을 가져오는 중 오류 발생: ${error.message}`,
      );
    }
  }

  async getUserSaleBiddingByUserId(
    userId: string,
    status: BiddingStatusEnum,
    qr?: QueryRunner,
  ) {
    const repo = this.getSaleBiddingRepository(qr);

    try {
      const bid = await repo
        .createQueryBuilder('saleBid')
        .leftJoinAndSelect(
          'saleBid.itemOption',
          'itemOption',
        )
        .leftJoinAndSelect('itemOption.item', 'item')
        .leftJoinAndSelect('item.images', 'images')
        .where('saleBid.user.id = :userId', { userId })
        .andWhere('saleBid.status = :status', {
          status,
        })
        .orderBy('saleBid.id', 'DESC')
        .getMany();

      return bid;
    } catch (error) {
      throw new Error(
        `입찰 내역을 가져오는 중 오류 발생: ${error.message}`,
      );
    }
  }

  async getHotItemsInBids(qr?: QueryRunner) {
    const repo = this.getPurchaseBiddingRepository(qr);
    const status = BiddingStatusEnum.COMPLETED;

    try {
      const items = await repo
        .createQueryBuilder('purchaseBid')
        .select([
          'item.id',
          'item.item_name_kr',
          'item.item_name_en',
          'MAX(images.path) as path', // 이미지 경로 중 하나만 선택
          'MIN(purchaseBid.price) as price', // 가격 중 하나만 선택
          'COUNT(purchaseBid.id) as item_count',
        ])
        .leftJoin('purchaseBid.itemOption', 'itemOption')
        .leftJoin('itemOption.item', 'item')
        .leftJoin('item.images', 'images')
        .where('purchaseBid.status = :status', { status })
        .groupBy('item.id')
        .orderBy('item_count', 'DESC')
        .getRawMany();

      return items;
    } catch (error) {
      throw new Error(
        `거래 많은 아이템 리스트를 가져오는 중 오류 발생: ${error.message}`,
      );
    }
  }
}

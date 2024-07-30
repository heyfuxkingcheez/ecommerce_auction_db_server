import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseBiddingModel } from './entities/purchase-bidding.entity';
import { MoreThan, QueryRunner, Repository } from 'typeorm';
import { ItemOptionsService } from 'src/items/item_options/item_options.service';
import { PaymentsService } from './../payments/payment.service';
import { AddressBooksService } from 'src/users/address-books/address-books.service';
import { CommonService } from 'src/common/common.service';
import { PurchaseBiddingDto } from './dto/purchase-bidding.dto';
import { SaleBiddingDto } from './dto/sale-bidding.dto';
import { SaleBiddingModel } from './entities/sale-bidding.entity';
import { BiddingStatusEnum } from './const/bidding-status.const';
import { BidExecutionModel } from './entities/bid-execution.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

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
    private readonly matchingBid: Queue,
    private readonly itemOptionService: ItemOptionsService,
    private readonly paymentsService: PaymentsService,
    private readonly addressBooksService: AddressBooksService,
  ) {
    this.matchingBid.on('error', (error) => {
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

      const newPurchaseBid = repo.create({
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

      await repo.save(newPurchaseBid);
      await this.isMatchingBids(
        dto.itemOptionId,
        dto.price,
        newPurchaseBid.id,
        null,
        qr,
      );

      return;
    } catch (error) {
      console.error(error);
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

      const newSaleBid = repo.create({
        user: {
          id: userId,
        },
        itemOption: {
          id: dto.itemOptionId,
        },
        expired_date: dto.expired_date,
        price: dto.price,
      });

      await repo.save(newSaleBid);
      await this.isMatchingBids(
        dto.itemOptionId,
        dto.price,
        null,
        newSaleBid.id,
        qr,
      );
      return;
    } catch (error) {
      console.error(error);
    }
  }

  private async isMatchingBids(
    itemOptionId: string,
    price: number,
    purchaseBiddingId?: string,
    saleBiddingId?: string,
    qr?: QueryRunner,
  ) {
    return purchaseBiddingId
      ? await this.findMatchingPurchaseBid(
          itemOptionId,
          price,
          purchaseBiddingId,
          qr,
        )
      : await this.findMatchingSaleBid(
          itemOptionId,
          price,
          saleBiddingId,
          qr,
        );
  }

  async findMatchingPurchaseBid(
    itemOptionId: string,
    price: number,
    purchaseBiddingId: string,
    qr?: QueryRunner,
  ) {
    const saleRepo = this.getSaleBiddingRepository(qr);
    try {
      const saleBid = await saleRepo.findOne({
        where: {
          itemOption: {
            id: itemOptionId,
          },
          price,
          expired_date: MoreThan(new Date()),
          status: BiddingStatusEnum.ONGOING,
        },
        order: { id: 'ASC' },
      });

      if (saleBid) {
        // console.log(`매치된 판매자 : ${saleBid.id}`);
        return this.matchingBidsQueue(
          purchaseBiddingId,
          saleBid.id,
        );
      }
      return;
    } catch (error) {
      console.error(error);
    }
  }

  async findMatchingSaleBid(
    itemOptionId: string,
    price: number,
    saleBiddingId: string,
    qr?: QueryRunner,
  ) {
    const purchaseRepo =
      this.getPurchaseBiddingRepository(qr);

    try {
      const purchaseBid = await purchaseRepo.findOne({
        where: {
          itemOption: {
            id: itemOptionId,
          },
          price,
          expired_date: MoreThan(new Date()),
          status: BiddingStatusEnum.ONGOING,
        },
        order: { id: 'ASC' },
      });

      if (purchaseBid) {
        return this.matchingBidsQueue(
          purchaseBid.id,
          saleBiddingId,
        );
      }
      return;
    } catch (error) {
      console.error(error);
    }
  }

  async matchingBidsQueue(
    purchaseBiddingId: string,
    saleBiddingId: string,
  ) {
    try {
      return await this.matchingBid.add(
        'matchingBid',
        {
          purchaseBiddingId,
          saleBiddingId,
        },
        {
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async postTransaction(
    purchaseBiddingId: string,
    saleBiddingId: string,
  ) {
    try {
      const newBidExecution =
        this.bidExecutionRepository.create({
          status: BiddingStatusEnum.ONGOING,
          saleBidding: {
            id: saleBiddingId,
          },
          purchaseBidding: {
            id: purchaseBiddingId,
          },
        });

      return await this.bidExecutionRepository.save(
        newBidExecution,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async updatePurchaseBidStatus(purchaseBiddingId: string) {
    try {
      return await this.purchaseBiddingRepository.update(
        purchaseBiddingId,
        {
          status: BiddingStatusEnum.COMPLETED,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async updateSaleBidStatus(saleBiddingId: string) {
    try {
      return await this.saleBiddingRepository.update(
        saleBiddingId,
        {
          status: BiddingStatusEnum.COMPLETED,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}

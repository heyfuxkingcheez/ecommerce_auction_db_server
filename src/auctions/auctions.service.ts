import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseBiddingModel } from './entities/purchase-bidding.entity';
import { Repository } from 'typeorm';
import { ItemOptionsService } from 'src/items/item_options/item_options.service';
import { PaymentsService } from './../payments/payment.service';
import { AddressBooksService } from 'src/users/address-books/address-books.service';
import { CommonService } from 'src/common/common.service';
import { PurchaseBiddingDto } from './dto/purchase-bidding.dto';
import { SaleBiddingDto } from './dto/sale-bidding.dto';
import { SaleBiddingModel } from './entities/sale-bidding.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(PurchaseBiddingModel)
    private readonly purchaseBiddingRepository: Repository<PurchaseBiddingModel>,
    @InjectRepository(SaleBiddingModel)
    private readonly saleBiddingRepository: Repository<SaleBiddingModel>,
    private readonly itemOptionService: ItemOptionsService,
    private readonly paymentsService: PaymentsService,
    private readonly addressBooksService: AddressBooksService,
    private readonly commonService: CommonService,
  ) {}

  async postPurchaseBidding(
    userId: string,
    dto: PurchaseBiddingDto,
  ) {
    await this.itemOptionService.getItemOpionByItemOptionId(
      dto.itemOptionId,
    );

    await this.paymentsService.getBillingKeyById(
      dto.paymentId,
    );

    await this.addressBooksService.getAddressById(
      dto.addressId,
      userId,
    );

    const newPurchaseBid =
      this.purchaseBiddingRepository.create({
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

    await this.commonService.purchaseBidsQueue(
      newPurchaseBid.id,
      userId,
      dto.itemOptionId,
      dto.price,
    );

    return await this.purchaseBiddingRepository.save(
      newPurchaseBid,
    );
  }

  async postSaleBidding(
    userId: string,
    dto: SaleBiddingDto,
  ) {
    await this.itemOptionService.getItemOpionByItemOptionId(
      dto.itemOptionId,
    );

    const newSaleBid = this.saleBiddingRepository.create({
      user: {
        id: userId,
      },
      itemOption: {
        id: dto.itemOptionId,
      },
      expired_date: dto.expired_date,
      price: dto.price,
    });

    await this.commonService.saleBidQueue(
      newSaleBid.id,
      userId,
      dto.itemOptionId,
      dto.price,
    );

    return await this.saleBiddingRepository.save(
      newSaleBid,
    );
  }
}

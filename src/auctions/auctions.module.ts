import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseBiddingModel } from './entities/purchase-bidding.entity';
import { ItemOptionsModule } from 'src/items/item_options/item_options.module';
import { PaymentsModule } from 'src/payments/payment.module';
import { AddressBooksModule } from 'src/users/address-books/address-books.module';
import { CommonModule } from 'src/common/common.module';
import { SaleBiddingModel } from './entities/sale-bidding.entity';
import { BidExecutionModel } from './entities/bid-execution.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseBiddingModel,
      SaleBiddingModel,
      BidExecutionModel,
    ]),
    ItemOptionsModule,
    PaymentsModule,
    AddressBooksModule,
    CommonModule,
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService],
})
export class AuctionsModule {}

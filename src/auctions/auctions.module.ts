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
import { AuctionsConsumer } from './auction.consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'auction',
      },
      { name: 'payment' },
    ),
    TypeOrmModule.forFeature([
      PurchaseBiddingModel,
      SaleBiddingModel,
      BidExecutionModel,
    ]),
    ItemOptionsModule,
    PaymentsModule,
    AddressBooksModule,
    CommonModule,
    PaymentsModule,
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, AuctionsConsumer],
  exports: [AuctionsService],
})
export class AuctionsModule {}

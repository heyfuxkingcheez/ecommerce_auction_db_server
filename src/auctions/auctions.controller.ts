import {
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { User } from 'src/users/decorator/user.decorator';
import { PurchaseBiddingDto } from './dto/purchase-bidding.dto';
import { SaleBiddingDto } from './dto/sale-bidding.dto';
import { QueryRunner as QR } from 'typeorm';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';

@Controller('auctions')
export class AuctionsController {
  constructor(
    private readonly auctionsService: AuctionsService,
  ) {}

  @Post('purchase-bid')
  @UseInterceptors(TransactionInterceptor)
  async postPurchaseBidding(
    @User('id') userId: string,
    @Body() dto: PurchaseBiddingDto,
    @QueryRunner() qr?: QR,
  ) {
    return await this.auctionsService.postPurchaseBidding(
      userId,
      dto,
      qr,
    );
  }

  @Post('sale-bid')
  @UseInterceptors(TransactionInterceptor)
  async postSaleBidding(
    @User('id') userId: string,
    @Body() dto: SaleBiddingDto,
    @QueryRunner() qr?: QR,
  ) {
    return await this.auctionsService.postSaleBidding(
      userId,
      dto,
      qr,
    );
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
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
import { BiddingStatusEnum } from './const/bidding-status.const';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

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

  @Get('purchase-bid/:itemId')
  async getPurchaseBiddingByItemId(
    @Param('itemId') itemId: string,
  ) {
    return await this.auctionsService.getBiddingByItemId(
      itemId,
      true,
    );
  }

  @Get('sale-bid/:itemId')
  async getSaleBiddingByItemId(
    @Param('itemId') itemId: string,
  ) {
    return await this.auctionsService.getBiddingByItemId(
      itemId,
      false,
    );
  }

  @Get('/me/purchase-bid/:status')
  async getUserPurchaseBiddingByUserId(
    @User('id') userId: string,
    @Param('status') status: BiddingStatusEnum,
  ) {
    return await this.auctionsService.getUserPurchaseBiddingByUserId(
      userId,
      status,
    );
  }

  @Get('/me/sale-bid/:status')
  async getUserSaleBiddingByUserId(
    @User('id') userId: string,
    @Param('status') status: BiddingStatusEnum,
  ) {
    return await this.auctionsService.getUserSaleBiddingByUserId(
      userId,
      status,
    );
  }

  @Get('hot')
  @IsPublic()
  async getHotItemsInBids() {
    return await this.auctionsService.getHotItemsInBids();
  }
}

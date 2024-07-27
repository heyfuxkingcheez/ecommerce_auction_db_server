import { Body, Controller, Post } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { User } from 'src/users/decorator/user.decorator';
import { PurchaseBiddingDto } from './dto/purchase-bidding.dto';
import { SaleBiddingDto } from './dto/sale-bidding.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(
    private readonly auctionsService: AuctionsService,
  ) {}

  @Post('purchase-bid')
  async postPurchaseBidding(
    @User('id') userId: string,
    @Body() dto: PurchaseBiddingDto,
  ) {
    return await this.auctionsService.postPurchaseBidding(
      userId,
      dto,
    );
  }

  @Post('sale-bid')
  async postSaleBidding(
    @User('id') userId: string,
    @Body() dto: SaleBiddingDto,
  ) {
    return await this.auctionsService.postSaleBidding(
      userId,
      dto,
    );
  }
}

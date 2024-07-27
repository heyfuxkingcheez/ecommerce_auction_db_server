import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('buyBids')
export class BuyBidConsumer {
  private readonly logger = new Logger(BuyBidConsumer.name);

  @Process('buyBid')
  async getBuyBidMessage(job: Job) {
    this.logger.log(
      `${job.data.buyId} 구매 입찰을 수신 했습니다.`,
    );
  }
}

@Processor('sellBids')
export class SellBidConsumer {
  private readonly logger = new Logger(
    SellBidConsumer.name,
  );

  @Process('sellBid')
  async getSellBidMessage(job: Job) {
    this.logger.log(
      `${job.data.sellId} 판매 입찰을 수신 했습니다.`,
    );
  }
}

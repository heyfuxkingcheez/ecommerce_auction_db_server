import {
  InjectQueue,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger, UseInterceptors } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { AuctionsService } from './auctions.service';

@Processor('auction')
export class AuctionsConsumer {
  constructor(
    private readonly auctionsService: AuctionsService,
    @InjectQueue('payment')
    private readonly reqBillingKey: Queue,
  ) {}
  private readonly logger = new Logger(
    AuctionsConsumer.name,
  );

  @Process('matchingBid')
  async getMatchingBid(job: Job) {
    this.logger.log(
      `거래 체결을 성공!. - 구매자 :${job.data.purchaseBiddingId} 판매자 : ${job.data.saleBiddingId}`,
    );

    await this.auctionsService.postTransaction(
      job.data.purchaseBiddingId,
      job.data.saleBiddingId,
    );

    await this.auctionsService.updatePurchaseBidStatus(
      job.data.purchaseBiddingId,
    );

    await this.auctionsService.updateSaleBidStatus(
      job.data.saleBiddingId,
    );

    const billingKey =
      await this.auctionsService.getPurchaseBiddingById(
        job.data.purchaseBiddingId,
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

    return this.logger.log(
      `결제 요청 발신 성공! ${billingKey.user.id}`,
    );
  }
}

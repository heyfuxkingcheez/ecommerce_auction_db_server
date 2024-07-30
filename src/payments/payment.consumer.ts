import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PaymentsService } from './payment.service';

@Processor('payment')
export class PaymentsConsumer {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  private readonly logger = new Logger(
    PaymentsConsumer.name,
  );

  @Process('reqBillingKey')
  async getReqBillingKey(job: Job) {
    this.logger.log(
      `결제 요청 수신 성공! ${job.data.userId}`,
    );

    await this.paymentsService.requestPaymentWithBillingKey(
      job.data.billingKey,
      job.data.userId,
      job.data.price,
    );
  }
}

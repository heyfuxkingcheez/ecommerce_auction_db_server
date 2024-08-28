import {
  InjectQueue,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import {
  BadRequestException,
  Inject,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
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
}

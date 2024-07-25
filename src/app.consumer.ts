import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('wook')
export class AppConsumer {
  private readonly logger = new Logger(AppConsumer.name);

  @Process('wook')
  getMessageQueue(job: Job) {
    this.logger.log(
      `${job.data.dataId} 번 작업을 수신했습니다.`,
    );
  }
}

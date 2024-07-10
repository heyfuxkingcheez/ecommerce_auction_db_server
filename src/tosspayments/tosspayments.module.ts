import { Module } from '@nestjs/common';
import { TosspaymentsService } from './tosspayments.service';
import { TosspaymentsController } from './tosspayments.controller';

@Module({
  controllers: [TosspaymentsController],
  providers: [TosspaymentsService],
  exports: [TosspaymentsService],
})
export class TosspaymentsModule {}

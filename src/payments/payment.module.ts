import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { PaymentsModel } from './entities/payments.entity';
import { PaymentsConsumer } from './payment.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsModel])],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsConsumer],
  exports: [PaymentsService],
})
export class PaymentsModule {}

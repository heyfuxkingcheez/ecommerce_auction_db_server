import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { PaymentsModel } from './entities/payments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsModel])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

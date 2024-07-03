import { Module } from '@nestjs/common';
import { PaymentInfosService } from './payment-infos.service';
import { PaymentInfosController } from './payment-infos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentInfoModel } from './entities/payment_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentInfoModel])],
  controllers: [PaymentInfosController],
  providers: [PaymentInfosService],
})
export class PaymentInfosModule {}

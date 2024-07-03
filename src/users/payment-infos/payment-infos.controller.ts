import { Controller } from '@nestjs/common';
import { PaymentInfosService } from './payment-infos.service';

@Controller('payment-infos')
export class PaymentInfosController {
  constructor(private readonly paymentInfosService: PaymentInfosService) {}
}

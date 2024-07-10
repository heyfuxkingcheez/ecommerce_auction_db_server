import { Controller } from '@nestjs/common';
import { PaymentsService } from './payment.service';

@Controller('payment-infos')
export class PaymentsController {
  constructor(
    private readonly paymentInfosService: PaymentsService,
  ) {}
}

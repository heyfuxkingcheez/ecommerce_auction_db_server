import { Controller, Get, Res } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { Request, Response } from 'express';
import { PUBLIC_FOLDER_PATH } from 'src/common/const/path.const';
import { join } from 'path';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentInfosService: PaymentsService,
  ) {}

  @Get('tosspayments')
  @IsPublic()
  requestPayment(@Res() res: Response) {
    res.sendFile(join(PUBLIC_FOLDER_PATH, 'checkout.html'));
  }
}

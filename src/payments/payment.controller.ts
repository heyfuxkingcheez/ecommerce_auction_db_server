import {
  Body,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { User } from 'src/users/decorator/user.decorator';
import { CardInfoDto } from './dto/card-info.dto';
import { STATUS_CODES } from 'http';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentInfosService: PaymentsService,
  ) {}

  @Post('billing-key')
  async postBillingKey(
    @User('id') userId: string,
    @Body() dto: CardInfoDto,
  ) {
    await this.paymentInfosService.postBillingKey(
      userId,
      dto,
    );

    return { STATUS_CODES: 200, message: '카드 등록 완료' };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { User } from 'src/users/decorator/user.decorator';
import { CardInfoDto } from './dto/card-info.dto';
import { STATUS_CODES } from 'http';
import { stringValidationMessage } from './../common/validation-message/string-validation.message';
import { PickType } from '@nestjs/mapped-types';
import { PaymentsModel } from './entities/payments.entity';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentInfosService: PaymentsService,
  ) {}
  @Get()
  async getBillingKey(@User('id') userId: string) {
    return await this.paymentInfosService.getBillingkeyByUserId(
      userId,
    );
  }

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

  @Delete('billing-key')
  async deleteBillingKey(
    @User('id') userId: string,
    @Body('billingKey') billingKey: string,
  ) {
    return await this.paymentInfosService.DeletePaymentWithBillingKey(
      billingKey,
      userId,
    );
  }
}

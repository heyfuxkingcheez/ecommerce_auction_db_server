import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsModel } from './entities/payments.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CardInfoDto } from './dto/card-info.dto';
import fetch from 'node-fetch';
import * as bcrypt from 'bcrypt';
import { v7 as uuidv7 } from 'uuid';
import { stringValidationMessage } from './../common/validation-message/string-validation.message';
import { StringSchema } from 'joi';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsModel)
    private readonly paymentsRepository: Repository<PaymentsModel>,
    private readonly configService: ConfigService,
  ) {}

  async postBillingKey(
    userId: string,
    dto: CardInfoDto,
  ): Promise<PaymentsModel> {
    const apiSecret =
      this.configService.get<string>('API_SECRET');
    const channelKey =
      this.configService.get<string>('CHANNEL_KEY');
    const hashRounds =
      this.configService.get<string>('HASH_ROUNDS');

    const issueResponse = await fetch(
      'https://api.portone.io/billing-keys',
      {
        method: 'POST',
        headers: {
          Authorization: `PortOne ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelKey: channelKey,
          customer: {
            id: userId,
          },
          method: {
            card: {
              credential: {
                number: dto.number,
                expiryYear: dto.expiryYear,
                expiryMonth: dto.expiryMonth,
                birthOrBusinessRegistrationNumber:
                  dto.birthOrBusinessRegistrationNumber,
                passwordTwoDigits: dto.passwordTwoDigits,
              },
            },
          },
        }),
      },
    );

    if (!issueResponse.ok)
      throw new InternalServerErrorException(
        `issueResponse: ${await issueResponse.json()}`,
      );

    const {
      billingKeyInfo: { billingKey },
    } = await issueResponse.json();

    const hash = bcrypt.hashSync(
      dto.payment_password,
      +hashRounds,
    );

    const newPayment = this.paymentsRepository.create({
      user: {
        id: userId,
      },
      billing_key: billingKey,
      payment_password: hash,
    });

    return await this.paymentsRepository.save(newPayment);
  }

  async getBillingkeyByUserId(userId: string) {
    return await this.paymentsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getBillingKeyById(
    billngKey: string,
    password: string,
  ) {
    const existbillngKey =
      await this.paymentsRepository.findOne({
        where: {
          id: billngKey,
        },
      });

    if (!existbillngKey)
      throw new NotFoundException(
        '존재하지 않는 결제 정보 입니다.',
      );

    const comparePassword = bcrypt.compareSync(
      password,
      existbillngKey.payment_password,
    );

    if (!comparePassword)
      throw new UnauthorizedException(
        '결제 비밀번호가 일치하지 않습니다.',
      );

    return existbillngKey;
  }

  async requestPaymentWithBillingKey(
    billingKey: string,
    userId: string,
    price: number,
  ) {
    const apiSecret =
      this.configService.get<string>('API_SECRET');
    try {
      const paymentResponse = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(uuidv7())}/billing-key`,
        {
          method: 'POST',
          headers: {
            Authorization: `PortOne ${apiSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            billingKey,
            orderName: '구매 입찰 결제',
            // 빌링키 결제 API를 참고해 고객 정보를 채워주세요.
            customer: {
              id: userId,
            },
            amount: {
              total: price,
            },
            currency: 'KRW',
          }),
        },
      );
      if (!paymentResponse.ok)
        throw new Error(
          `paymentResponse: ${await paymentResponse.json()}`,
        );

      console.log(await paymentResponse.json());
    } catch (error) {
      console.log(error);
    }
  }

  async DeletePaymentWithBillingKey(
    billingKey: string,
    userId: string,
  ) {
    const apiSecret =
      this.configService.get<string>('API_SECRET');
    const url = `https://api.portone.io/billing-keys/${billingKey}`;
    const options = {
      method: 'delete',
      headers: {
        Authorization: `PortOne ${apiSecret}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    };
    try {
      const existBillingKey =
        await this.paymentsRepository.findOne({
          where: {
            user: {
              id: userId,
            },
            billing_key: billingKey,
          },
        });

      if (!existBillingKey)
        throw new BadRequestException(
          '등록되지 않은 결제 정보 입니다.',
        );

      const response = await fetch(url, options);
      const data = await response.json();
      if (!data.deletedAt)
        throw new BadRequestException('삭제 실패!');

      return await this.paymentsRepository.delete(
        existBillingKey.id,
      );
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }
}

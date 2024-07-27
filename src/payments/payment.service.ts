import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsModel } from './entities/payments.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CardInfoDto } from './dto/card-info.dto';
import fetch from 'node-fetch';
import * as bcrypt from 'bcrypt';

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

  async getBillingKeyById(billngKey: string) {
    const existbillngKey =
      await this.paymentsRepository.find({
        where: {
          id: billngKey,
        },
      });

    if (!existbillngKey)
      throw new NotFoundException(
        '존재하지 않는 결제 정보 입니다.',
      );

    return existbillngKey;
  }
}

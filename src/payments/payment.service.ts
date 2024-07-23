import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsModel } from './entities/payments.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CardInfoDto } from './dto/card-info.dto';
import fetch from 'node-fetch';

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
                ...dto,
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

    const newPayment = this.paymentsRepository.create({
      user: {
        id: userId,
      },
      billing_key: billingKey,
    });

    return await this.paymentsRepository.save(newPayment);
  }
}

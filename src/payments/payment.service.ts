import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsModel } from './entities/payments.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsModel)
    private readonly paymentsRepository: Repository<PaymentsModel>,
  ) {}

  async postPayment(
    userId: string,
  ): Promise<PaymentsModel> {
    const createUUID = uuid();
    const payment = this.paymentsRepository.create({
      user: {
        id: userId,
      },
      payment_key: createUUID,
    });

    return await this.paymentsRepository.save(payment);
  }
}

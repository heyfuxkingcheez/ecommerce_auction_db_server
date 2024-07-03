import { Test, TestingModule } from '@nestjs/testing';
import { PaymentInfosService } from './payment-infos.service';

describe('PaymentInfosService', () => {
  let service: PaymentInfosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentInfosService],
    }).compile();

    service = module.get<PaymentInfosService>(PaymentInfosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

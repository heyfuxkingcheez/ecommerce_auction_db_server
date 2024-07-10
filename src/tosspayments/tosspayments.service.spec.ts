import { Test, TestingModule } from '@nestjs/testing';
import { TosspaymentsService } from './tosspayments.service';

describe('TosspaymentsService', () => {
  let service: TosspaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TosspaymentsService],
    }).compile();

    service = module.get<TosspaymentsService>(TosspaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

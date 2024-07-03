import { Test, TestingModule } from '@nestjs/testing';
import { SettlementAccountsService } from './settlement-accounts.service';

describe('SettlementAccountsService', () => {
  let service: SettlementAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettlementAccountsService],
    }).compile();

    service = module.get<SettlementAccountsService>(SettlementAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

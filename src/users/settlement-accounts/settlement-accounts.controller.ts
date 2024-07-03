import { Controller } from '@nestjs/common';
import { SettlementAccountsService } from './settlement-accounts.service';

@Controller('settlement-accounts')
export class SettlementAccountsController {
  constructor(private readonly settlementAccountsService: SettlementAccountsService) {}
}

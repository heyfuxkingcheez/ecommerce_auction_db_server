import { PickType } from '@nestjs/mapped-types';
import { SettlementAccountModel } from '../entities/settlement_account.entity';

export class CreateSettlementDto extends PickType(
  SettlementAccountModel,
  ['bank_name', 'account_holder', 'account_number'],
) {}

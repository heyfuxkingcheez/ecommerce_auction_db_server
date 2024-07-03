import { Module } from '@nestjs/common';
import { SettlementAccountsService } from './settlement-accounts.service';
import { SettlementAccountsController } from './settlement-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementAccountModel } from './entities/settlement_account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettlementAccountModel])],
  controllers: [SettlementAccountsController],
  providers: [SettlementAccountsService],
})
export class SettlementAccountsModule {}

import { Module } from '@nestjs/common';
import { SettlementAccountsService } from './settlement-accounts.service';
import { SettlementAccountsController } from './settlement-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementAccountModel } from './entities/settlement_account.entity';
import { UsersModule } from '../users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettlementAccountModel]),
    UsersModule,
  ],
  controllers: [SettlementAccountsController],
  providers: [SettlementAccountsService],
})
export class SettlementAccountsModule {}

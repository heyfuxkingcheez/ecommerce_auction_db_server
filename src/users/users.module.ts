import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AddressBookModel,
  CardInfoModel,
  PaymentInfoModel,
  UserModel,
  SettlementAccountModel,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserModel,
      PaymentInfoModel,
      CardInfoModel,
      AddressBookModel,
      SettlementAccountModel,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

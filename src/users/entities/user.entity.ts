import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { RolesEnum } from '../const';
import { PaymentInfoModel } from '../payment-infos/entities/payment_info.entity';
import { AddressBookModel } from '../address-books/entities/address_book.entity';
import { SettlementAccountModel } from '../settlement-accounts/entities/settlement_account.entity';

@Entity()
export class UserModel extends BaseModel {
  @Column({ length: 20, unique: true, nullable: false })
  @IsString()
  @Length(1, 20)
  nickname: string;

  @Column({ unique: true, nullable: false })
  @IsString()
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @IsString()
  @Length(8, 20)
  // @Exclude({
  //   toPlainOnly: true,
  // })
  password: string;

  @Column({ unique: true, nullable: false })
  @IsNumber()
  @IsPhoneNumber()
  phone_number: number;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PaymentInfoModel, (PaymentInfo) => PaymentInfo.user)
  payment_infos: PaymentInfoModel[];

  @OneToMany(() => AddressBookModel, (addressBook) => addressBook.user)
  address_books: AddressBookModel[];

  @OneToOne(
    () => SettlementAccountModel,
    (settlementAccount) => settlementAccount.user,
  )
  settlement_account: SettlementAccountModel;
}

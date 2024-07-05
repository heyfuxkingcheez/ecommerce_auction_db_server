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
import {
  emailValidationMessage,
  lengthValidationMessage,
  numberValidationMessage,
  stringValidationMessage,
} from 'src/common/validation-message';

@Entity()
export class UserModel extends BaseModel {
  @Column({ length: 20, unique: true, nullable: false })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @Column({ unique: true, nullable: false })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column({ nullable: false })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(8, 20, {
    message: lengthValidationMessage,
  })
  // @Exclude({
  //   toPlainOnly: true,
  // })
  password: string;

  @Column({ unique: true, nullable: false })
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
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

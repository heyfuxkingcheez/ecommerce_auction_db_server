import { Exclude, Transform } from 'class-transformer';
import { BaseModel } from 'src/common/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
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
import {
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { join } from 'path';
import { USER_PUBLIC_PROFILE_IMAGE_PATH } from 'src/common/const/path.const';
import { DEFAULT_PROFILE_IAMGE } from 'src/common/const/default_value.const';

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
  @IsString({
    message: stringValidationMessage,
  })
  @IsPhoneNumber('KR', {
    message: '휴대폰 번호 형식이 아닙니다.',
  })
  phone_number: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @Column({
    nullable: true,
    default: DEFAULT_PROFILE_IAMGE,
  })
  @IsString()
  @Transform(
    ({ value }) =>
      value &&
      `/${join(USER_PUBLIC_PROFILE_IMAGE_PATH, value)}`,
  )
  image?: string;

  @OneToMany(
    () => PaymentInfoModel,
    (PaymentInfo) => PaymentInfo.user,
  )
  payment_infos: PaymentInfoModel[];

  @OneToMany(
    () => AddressBookModel,
    (addressBook) => addressBook.user,
  )
  address_books: AddressBookModel[];

  @OneToOne(
    () => SettlementAccountModel,
    (settlementAccount) => settlementAccount.user,
  )
  settlement_account: SettlementAccountModel;
}

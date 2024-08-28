import { BaseModel } from 'src/common/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { UserModel } from 'src/users/entities';
import { AddressBookModel } from 'src/users/address-books/entities/address_book.entity';
import { PaymentsModel } from 'src/payments/entities/payments.entity';
import { ItemOptionModel } from 'src/items/item_options/entities/item-option.entitiy';
import { BiddingStatusEnum } from '../const/bidding-status.const';
import { BidExecutionModel } from './bid-execution.entity';

@Entity()
export class PurchaseBiddingModel extends BaseModel {
  @Column()
  @IsNumber()
  price: number;

  @Column()
  @IsDate()
  expired_date: Date;

  @Column({ default: BiddingStatusEnum.ONGOING })
  @IsEnum(BiddingStatusEnum)
  status: BiddingStatusEnum;

  @Column()
  @IsString()
  delivery_instruction: string;

  @ManyToOne(
    () => UserModel,
    (user) => user.purchaseBidding,
  )
  user: UserModel;

  @ManyToOne(
    () => AddressBookModel,
    (addressBook) => addressBook.purchaseBidding,
  )
  address: AddressBookModel;

  @ManyToOne(
    () => PaymentsModel,
    (payment) => payment.purchaseBidding,
  )
  payment: PaymentsModel;

  @ManyToOne(
    () => ItemOptionModel,
    (itemOption) => itemOption.purchaseBidding,
  )
  itemOption: ItemOptionModel;

  @OneToMany(
    () => BidExecutionModel,
    (bidExecution) => bidExecution.purchaseBidding,
  )
  bidExecution: BidExecutionModel[];
}

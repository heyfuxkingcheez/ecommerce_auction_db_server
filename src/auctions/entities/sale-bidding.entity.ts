import { BaseModel } from 'src/common/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BiddingStatusEnum } from '../const/bidding-status.const';
import { IsDate, IsEnum, IsNumber } from 'class-validator';
import { UserModel } from 'src/users/entities';
import { ItemOptionModel } from 'src/items/item_options/entities/item-option.entitiy';
import { BidExecutionModel } from './bid-execution.entity';
import { AddressBookModel } from 'src/users/address-books/entities/address_book.entity';

@Entity()
export class SaleBiddingModel extends BaseModel {
  @Column()
  @IsNumber()
  price: number;

  @Column()
  @IsDate()
  expired_date: Date;

  @Column({ default: BiddingStatusEnum.ONGOING })
  @IsEnum(BiddingStatusEnum)
  status: BiddingStatusEnum;

  @ManyToOne(() => UserModel, (user) => user.saleBidding)
  user: UserModel;

  @ManyToOne(
    () => ItemOptionModel,
    (itemOption) => itemOption.saleBidding,
  )
  itemOption: ItemOptionModel;

  @ManyToOne(
    () => AddressBookModel,
    (address) => address.saleBidding,
  )
  address: AddressBookModel;

  @OneToMany(
    () => BidExecutionModel,
    (bidExecution) => bidExecution.saleBidding,
  )
  bidExecution: BidExecutionModel[];
}

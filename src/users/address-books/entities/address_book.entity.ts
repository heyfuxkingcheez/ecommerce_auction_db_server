import { IsNumber, IsString } from 'class-validator';
import { PurchaseBiddingModel } from 'src/auctions/entities/purchase-bidding.entity';
import { BaseModel } from 'src/common/entities';
import { UserModel } from 'src/users/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class AddressBookModel extends BaseModel {
  @Column()
  @IsString()
  address_name: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsNumber()
  zip_code: number;

  @Column()
  @IsString()
  address: string;

  @ManyToOne(() => UserModel, (user) => user.address_books)
  user: UserModel;

  @OneToMany(
    () => PurchaseBiddingModel,
    (purchaseBidding) => purchaseBidding.address,
  )
  purchaseBidding: PurchaseBiddingModel[];
}

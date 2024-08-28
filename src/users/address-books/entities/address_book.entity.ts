import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { PurchaseBiddingModel } from 'src/auctions/entities/purchase-bidding.entity';
import { SaleBiddingModel } from 'src/auctions/entities/sale-bidding.entity';
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
  @IsNotEmpty()
  address_name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  zip_code: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ManyToOne(() => UserModel, (user) => user.address_books)
  user: UserModel;

  @OneToMany(
    () => PurchaseBiddingModel,
    (purchaseBidding) => purchaseBidding.address,
  )
  purchaseBidding: PurchaseBiddingModel[];

  @OneToMany(
    () => SaleBiddingModel,
    (saleBidding) => saleBidding.address,
  )
  saleBidding: SaleBiddingModel[];
}

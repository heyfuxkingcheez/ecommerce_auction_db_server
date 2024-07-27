import { BaseModel } from 'src/common/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { ItemOptionEnum } from 'src/items/const/itemOpion.const';
import { ItemModel } from 'src/items/entities/item.entity';
import { PurchaseBiddingModel } from 'src/auctions/entities/purchase-bidding.entity';
import { SaleBiddingModel } from 'src/auctions/entities/sale-bidding.entity';
import { BidExecutionModel } from 'src/auctions/entities/bid-execution.entity';

@Entity()
export class ItemOptionModel extends BaseModel {
  @Column()
  @IsEnum(ItemOptionEnum)
  option: ItemOptionEnum;

  @ManyToOne(
    (type) => ItemModel,
    (item) => item.itemOptions,
  )
  item: ItemModel;

  @OneToMany(
    () => PurchaseBiddingModel,
    (purchaseBidding) => purchaseBidding.itemOption,
  )
  purchaseBidding: PurchaseBiddingModel[];

  @OneToMany(
    () => SaleBiddingModel,
    (saleBidding) => saleBidding.itemOption,
  )
  saleBidding: SaleBiddingModel[];
}

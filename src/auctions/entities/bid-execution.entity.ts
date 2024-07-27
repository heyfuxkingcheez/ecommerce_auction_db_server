import { BaseModel } from 'src/common/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BiddingStatusEnum } from '../const/bidding-status.const';
import { IsEnum } from 'class-validator';
import { PurchaseBiddingModel } from './purchase-bidding.entity';
import { SaleBiddingModel } from './sale-bidding.entity';

@Entity()
export class BidExecutionModel extends BaseModel {
  @Column({ default: BiddingStatusEnum.ONGOING })
  @IsEnum(BiddingStatusEnum)
  status: BiddingStatusEnum;

  @ManyToOne(
    () => PurchaseBiddingModel,
    (purchaseBidding) => purchaseBidding.bidExecution,
  )
  purchaseBidding: PurchaseBiddingModel;

  @ManyToOne(
    () => SaleBiddingModel,
    (saleBidding) => saleBidding.bidExecution,
  )
  saleBidding: SaleBiddingModel;
}

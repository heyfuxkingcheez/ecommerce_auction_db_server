import { IsCreditCard, IsDate, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PaymentInfoModel } from './payment_info.entity';

@Entity()
export class CardInfoModel extends BaseModel {
  @Column()
  @IsString()
  @IsCreditCard()
  card_number: string;

  @Column()
  @IsString()
  card_password: string;

  @Column()
  @IsString()
  expiration: string;

  @Column()
  @IsDate()
  birth_date: Date;

  @ManyToOne(() => PaymentInfoModel, (paymentInfo) => paymentInfo.card_info)
  payment_info: PaymentInfoModel;
}

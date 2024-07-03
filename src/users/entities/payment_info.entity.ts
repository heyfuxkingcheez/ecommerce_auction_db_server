import { BaseModel } from 'src/common/entities';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from './user.entity';
import { CardInfoModel } from './card_info.entity';

@Entity()
export class PaymentInfoModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.payment_infos)
  user: UserModel;

  @OneToMany(() => CardInfoModel, (cardInfo) => cardInfo.payment_info)
  card_info: CardInfoModel[];
}

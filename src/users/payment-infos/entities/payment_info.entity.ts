import { BaseModel } from 'src/common/entities';
import { UserModel } from 'src/users/entities';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CardInfoModel } from '../card-infos/entities/card_info.entity';

@Entity()
export class PaymentInfoModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.payment_infos)
  user: UserModel;

  @OneToMany(() => CardInfoModel, (cardInfo) => cardInfo.payment_info)
  card_info: CardInfoModel[];
}

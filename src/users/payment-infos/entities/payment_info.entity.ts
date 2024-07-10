import { BaseModel } from 'src/common/entities';
import { UserModel } from 'src/users/entities';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';


@Entity()
export class PaymentInfoModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.payment_infos)
  user: UserModel;
}

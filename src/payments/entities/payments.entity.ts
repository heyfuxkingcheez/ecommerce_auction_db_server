import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { stringValidationMessage } from 'src/common/validation-message';
import { UserModel } from 'src/users/entities';
import internal from 'stream';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class PaymentsModel extends BaseModel {
  @Column({ nullable: false })
  @IsString({
    message: stringValidationMessage,
  })
  payment_key: string;

  @ManyToOne(() => UserModel, (user) => user.payments)
  user: UserModel;
}

import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { UserModel } from 'src/users/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class SettlementAccountModel extends BaseModel {
  @Column({ nullable: false })
  @IsString()
  bank_name: string;

  @Column({ nullable: false })
  @IsString()
  account_number: string;

  @Column({ nullable: false })
  @IsString()
  account_holder: string;

  @OneToOne(
    () => UserModel,
    (user) => user.settlement_account,
  )
  @JoinColumn({
    name: 'user_id',
  })
  user: UserModel;
}

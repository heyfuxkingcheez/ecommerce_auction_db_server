import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { UserModel } from 'src/users/entities';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class SettlementAccountModel extends BaseModel {
  @Column()
  @IsString()
  bank_name: string;

  @Column()
  @IsNumber()
  account_number: number;

  @Column()
  @IsString()
  account_holder: string;

  @OneToOne(() => UserModel, (user) => user.settlement_account)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserModel;
}

import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserModel } from './user.entity';

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

  @OneToMany(() => UserModel, (user) => user.settlement_account)
  user: UserModel;
}

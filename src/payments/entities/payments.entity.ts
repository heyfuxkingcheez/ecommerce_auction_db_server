import { Exclude } from 'class-transformer';
import {
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { BaseModel } from 'src/common/entities';
import {
  lengthValidationMessage,
  stringValidationMessage,
} from 'src/common/validation-message';
import { UserModel } from 'src/users/entities';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PaymentsModel extends BaseModel {
  @Column({ nullable: false })
  @IsString({
    message: stringValidationMessage,
  })
  billing_key: string;

  @Column()
  @IsString()
  @Length(4, 6, {
    message: lengthValidationMessage,
  })
  @Exclude({
    toPlainOnly: true,
  })
  payment_password: string;

  @ManyToOne(() => UserModel, (user) => user.payments)
  user: UserModel;
}

import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class AddressBookModel extends BaseModel {
  @Column()
  @IsString()
  address_name: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsNumber()
  zip_code: number;

  @Column()
  @IsString()
  address: string;

  @ManyToOne(() => UserModel, (user) => user.address_books)
  user: UserModel;
}

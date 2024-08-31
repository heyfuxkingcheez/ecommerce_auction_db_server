import { IsString } from 'class-validator';

export class TagItemDto {
  @IsString()
  tagId: string;

  @IsString()
  itemId: string;
}

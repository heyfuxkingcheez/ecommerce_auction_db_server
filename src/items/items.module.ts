import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModel } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemModel])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}

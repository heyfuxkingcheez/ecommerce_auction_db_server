import { Module } from '@nestjs/common';
import { ItemOptionsService } from './item_options.service';
import { ItemOptionsController } from './item_options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemOptionModel } from './entities/item-option.entitiy';
import { ItemsModule } from '../items.module';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemOptionModel]),
    ItemsModule,
    CommonModule,
    AuthModule,
  ],
  controllers: [ItemOptionsController],
  providers: [ItemOptionsService],
})
export class ItemOptionsModule {}

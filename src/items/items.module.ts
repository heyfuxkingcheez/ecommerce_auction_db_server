import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModel } from './entities/item.entity';
import { CommonModule } from 'src/common/common.module';
import { ImagesService } from './images/images.service';
import { ImageModel } from 'src/common/entities/image.entity';
import { ItemOptionModel } from './entities/item-option.entitiy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/users/guard/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemModel,
      ImageModel,
      ItemOptionModel,
    ]),
    CommonModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ImagesService],
  exports: [ItemsService],
})
export class ItemsModule {}

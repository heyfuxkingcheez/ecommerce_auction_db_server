import { Module } from '@nestjs/common';
import { CardInfosService } from './card-infos.service';
import { CardInfosController } from './card-infos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardInfoModel } from './entities/card_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardInfoModel])],
  controllers: [CardInfosController],
  providers: [CardInfosService],
})
export class CardInfosModule {}

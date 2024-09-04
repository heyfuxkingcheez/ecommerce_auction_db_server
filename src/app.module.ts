import {
  ClassSerializerInterceptor,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { AddressBooksModule } from './users/address-books/address-books.module';
import { SettlementAccountsModule } from './users/settlement-accounts/settlement-accounts.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';
import { LogInterceptor } from './common/interceptor/log.interceptor';
import { PaymentsModule } from './payments/payment.module';
import { RolesGuard } from './users/guard/roles.guard';
import { ItemsModule } from './items/items.module';
import { ItemOptionsModule } from './items/item_options/item_options.module';
import { BullModule } from '@nestjs/bull';
import { AppConsumer } from './app.consumer';
import { AuctionsModule } from './auctions/auctions.module';
import { RedlockModule } from './redlock/redlock.module';
import { CouponsModule } from './coupons/coupons.module';
import { UserCouponModel } from './coupons/entities/user-coupon.entity';
import { SseModule } from './sse/sse.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize:
          configService.get<string>('RUNTIME') !== 'prod',
        ssl: {
          rejectUnauthorized: false,
        },
        // logging: true,
      }),
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>(
            'REDIS_BULL_HOST',
          ),
          port: configService.get<number>(
            'REDIS_BULL_PORT',
          ),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CommonModule,
    PaymentsModule,
    AddressBooksModule,
    SettlementAccountsModule,
    ItemsModule,
    ItemOptionsModule,
    AuctionsModule,
    RedlockModule,
    CouponsModule,
    SseModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [
    AppConsumer,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

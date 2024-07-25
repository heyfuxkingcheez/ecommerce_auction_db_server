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
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.forRoot('alternate-config', {
      redis: {
        host: '172.21.0.3',
        port: 6379,
      },
    }),
    AuthModule,
    UsersModule,
    CommonModule,
    PaymentsModule,
    AddressBooksModule,
    SettlementAccountsModule,
    ItemsModule,
    ItemOptionsModule,
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

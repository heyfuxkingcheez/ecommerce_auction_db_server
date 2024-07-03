import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PaymentInfosModule } from './users/payment-infos/payment-infos.module';
import { CardInfosModule } from './users/payment-infos/card-infos/card-infos.module';
import { AddressBooksModule } from './users/address-books/address-books.module';
import { SettlementAccountsModule } from './users/settlement-accounts/settlement-accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
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
        synchronize: configService.get<string>('RUNTIME') !== 'prod',
      }),
    }),
    AuthModule,
    UsersModule,
    CommonModule,
    PaymentInfosModule,
    CardInfosModule,
    AddressBooksModule,
    SettlementAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { BcryptHasher } from './common/services/bcrypt-hasher.service';
import { PrismaService } from './common/services/prisma.service';
import { CurrencyModule } from './currency/currency.module';
import { GuideModule } from './guide/guide.module';
import { NetworkModule } from './network/network.module';
import { NetworkTypeModule } from './network-type/network-type.module';
import { OperationModule } from './operation/operation.module';
import { OperationTypeModule } from './operation-type/operation-type.module';
import { SessionModule } from './session/session.module';
import { AdminInitService } from './user/admin-init.service';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { WalletTypeModule } from './wallet-type/wallet-type.module';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow('THROTTLER_TTL_MS'),
          limit: configService.getOrThrow('THROTTLER_LIMIT'),
        },
      ],
    }),
    AuthModule,
    GuideModule,
    CurrencyModule,
    ApplicationModule,
    UserModule,
    OperationModule,
    OperationTypeModule,
    SessionModule,
    WalletModule,
    WalletTypeModule,
    NetworkModule,
    NetworkTypeModule,
    ParserModule,
  ],
  providers: [PrismaService, BcryptHasher, AdminInitService],
})
export class MainModule {}

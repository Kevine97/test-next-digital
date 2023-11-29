import { Module } from '@nestjs/common';
import { DataBaseConfiguration } from './db/database-configuration.db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { CardModule } from './card/card.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forRoot(DataBaseConfiguration), AccountModule, CardModule, TransactionModule],
  controllers: [],
})
export class AppModule {}

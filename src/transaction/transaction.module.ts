import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/db/entity/card.entity';
import { Account } from 'src/db/entity/account.entity';
import { Transaction } from 'src/db/entity/transaction.entity';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [TypeOrmModule.forFeature([Card, Account, Transaction])],
})
export class TransactionModule {}

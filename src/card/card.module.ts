import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../db/entity/card.entity';
import { Account } from '../db/entity/account.entity';
import { AccountService } from 'src/account/account.service';

@Module({
  controllers: [CardController],
  providers: [CardService, AccountService],
  imports: [TypeOrmModule.forFeature([Card, Account])],
})
export class CardModule {}

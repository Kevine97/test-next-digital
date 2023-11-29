import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { transactionTypeEnum } from '../../core/enums/transaction-type';
import { IsDecimal, IsEnum, IsNotEmpty } from 'class-validator';
import { BaseEntity } from './base/base';
import { Account } from './account.entity';
import { Card } from './card.entity';

@Entity('transaction')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @IsEnum(transactionTypeEnum)
  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: transactionTypeEnum,
  })
  type: transactionTypeEnum;

  @IsDecimal()
  @IsNotEmpty()
  @Column({ type: 'decimal' })
  amount: number;

  @IsDecimal()
  @Column({ nullable: true, type: 'decimal' })
  commission: number;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({
    name: 'accountId',
    referencedColumnName: 'accountId',
  })
  account: Account;

  @ManyToOne(() => Card, (card) => card.transactions)
  @JoinColumn({
    name: 'cardId',
    referencedColumnName: 'cardId',
  })
  card: Card;
}

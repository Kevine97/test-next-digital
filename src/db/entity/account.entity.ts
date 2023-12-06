import {
  IsEnum,
  IsIBAN,
  IsNotEmpty,
  IsString,
  IsDecimal,
} from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base';
import { bankingEntitiesEnum } from '../../core/enums/banking.entities.enum';
import { Card } from './card.entity';
import { Transaction } from './transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('account')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  accountId: number;

  @IsNotEmpty()
  @IsString()
  @IsIBAN()
  @ApiProperty()
  @Column({ unique: true })
  iban: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(bankingEntitiesEnum)
  @Column({
    type: 'enum',
    enum: bankingEntitiesEnum,
  })
  entity: bankingEntitiesEnum;

  @IsDecimal()
  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  availableBalance: string;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[];
}

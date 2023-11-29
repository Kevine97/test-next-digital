import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CardTypeEnum } from 'src/core/enums/card-type.enum';
import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { BaseEntity } from './base/base';
import { Transaction } from './transaction.entity';
import { Account } from './account.entity';

@Entity('card')
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cardId: number;

  @IsString()
  @IsNotEmpty()
  @Column({ unique: true })
  cardNumber: string;

  @IsEnum(CardTypeEnum)
  @IsNotEmpty()
  @Column({
    enum: CardTypeEnum,
    type: 'enum',
  })
  cardType: CardTypeEnum;

  @IsString()
  @IsNotEmpty()
  @Column()
  cvv: string;

  @IsBoolean()
  @Column({
    default: false,
  })
  isActive: boolean;

  @IsDecimal()
  @IsNotEmpty()
  @Column({ type: 'decimal' })
  moneyLimit: number;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transactions: Transaction[];

  @ManyToOne(() => Account, (account) => account.cards)
  @JoinColumn({
    name: 'accountId',
    referencedColumnName: 'accountId',
  })
  account: Account;
}

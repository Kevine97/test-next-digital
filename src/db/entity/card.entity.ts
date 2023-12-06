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
  Length,
} from 'class-validator';
import { BaseEntity } from './base/base';
import { Transaction } from './transaction.entity';
import { Account } from './account.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('card')
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cardId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Column({ unique: true })
  cardNumber: string;

  @IsEnum(CardTypeEnum)
  @IsNotEmpty()
  @ApiProperty()
  @Column({
    enum: CardTypeEnum,
    type: 'enum',
  })
  cardType: CardTypeEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Column()
  cvv: string;

  @IsBoolean()
  @Column({
    default: false,
  })
  isActive: boolean;

  @IsDecimal()
  @IsNotEmpty()
  @ApiProperty()
  @Column({ type: 'decimal' })
  moneyLimit: number;

  @IsDecimal()
  @IsNotEmpty()
  @ApiProperty()
  @Column({ type: 'decimal', nullable: true })
  creditLimit?: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'The pin must have exactly 3 digits' })
  @ApiProperty()
  @Column()
  pin: string;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transactions: Transaction[];

  @ManyToOne(() => Account, (account) => account.cards)
  @JoinColumn({
    name: 'accountId',
    referencedColumnName: 'accountId',
  })
  account: Account;
}

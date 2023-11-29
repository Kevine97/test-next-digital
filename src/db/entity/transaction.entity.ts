import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { transactionTypeEnum } from '../../core/enums/transaction-type';
import { IsDecimal, IsEnum, IsNotEmpty } from 'class-validator';
import { BaseEntity } from './base/base';

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
}

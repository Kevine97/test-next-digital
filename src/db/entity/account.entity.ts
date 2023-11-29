import {
  IsEnum,
  IsIBAN,
  IsNotEmpty,
  IsString,
  IsDecimal,
} from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './base/base';
import { bankingEntitiesEnum } from 'src/core/enums/banking.entities.enum';

@Entity('account')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  accountId: number;

  @IsNotEmpty()
  @IsString()
  @IsIBAN()
  @Column({ unique: true })
  iban: string;

  @IsNotEmpty()
  @IsEnum(bankingEntitiesEnum)
  @Column({
    type: 'enum',
    enum: bankingEntitiesEnum,
  })
  entity: bankingEntitiesEnum;

  @IsDecimal()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  availableBalance: string;
}
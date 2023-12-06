import { ApiProperty } from '@nestjs/swagger';
import { transactionTypeEnum } from '../core/enums/transaction-type';

export class WithdrawingMoneyDto {
  @ApiProperty()
  type: transactionTypeEnum;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  numberCard: string;
  @ApiProperty()
  enttity: string;
}

export class DepositMoneyDto {
  @ApiProperty()
  type: transactionTypeEnum;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  numberCard: string;
  @ApiProperty()
  enttityAtm: string;
}

export class TransferMoneyDto {
  @ApiProperty()
  ibanEmitter: string;
  @ApiProperty()
  ibanReceiver: string;
  @ApiProperty()
  amount: number;
}

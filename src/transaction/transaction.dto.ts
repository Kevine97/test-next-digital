import { transactionTypeEnum } from '../core/enums/transaction-type';

export class WithdrawingMoneyDto {
  type: transactionTypeEnum;
  amount: number;
  numberCard: string;
  enttity: string;
}

export class DepositMoneyDto {
  type: transactionTypeEnum;
  amount: number;
  numberCard: string;
  enttityAtm: string;
}

export class TransferMoneyDto {
  ibanEmitter: string;
  ibanReceiver: string;
  amount: number;
}

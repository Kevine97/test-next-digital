import { transactionTypeEnum } from '../core/enums/transaction-type';

export class WithdrawingMoneyDto {
  type: transactionTypeEnum;
  amount: number;
  numberCard: string;
  enttity: string;
}

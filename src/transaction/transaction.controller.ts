import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  DepositMoneyDto,
  TransferMoneyDto,
  WithdrawingMoneyDto,
} from './transaction.dto';

@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('withdrawing-money')
  async withdrawingMoney(
    @Body() withdrawingMoneyDto: WithdrawingMoneyDto,
  ): Promise<string> {
    return await this.transactionService.withdrawingMoney(withdrawingMoneyDto);
  }

  @Post('deposit-money')
  async depositMoney(
    @Body() depositMoneyDto: DepositMoneyDto,
  ): Promise<string> {
    return await this.transactionService.depositMoney(depositMoneyDto);
  }

  @Post('transfer-money')
  async transferMoney(
    @Body() transferMoneyDto: TransferMoneyDto,
  ): Promise<string> {
    return await this.transactionService.transferMoney(transferMoneyDto);
  }
}

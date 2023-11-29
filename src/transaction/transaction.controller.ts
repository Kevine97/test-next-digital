import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { WithdrawingMoneyDto } from './transaction.dto';

@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async withdrawingMoney(
    @Body() withdrawingMoneyDto: WithdrawingMoneyDto,
  ): Promise<string> {
    return await this.transactionService.withdrawingMoney(withdrawingMoneyDto);
  }
}

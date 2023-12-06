import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  DepositMoneyDto,
  TransferMoneyDto,
  WithdrawingMoneyDto,
} from './transaction.dto';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMenssageOK } from 'src/card/card.dto';

@Controller('api/v1/transaction')
@ApiTags('api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('withdrawing-money')
  @ApiResponse({
    description: 'Transaction not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Transaction access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Transaction returned successfully',
    type: ResponseMenssageOK,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async withdrawingMoney(
    @Body() withdrawingMoneyDto: WithdrawingMoneyDto,
  ): Promise<ResponseMenssageOK> {
    return await this.transactionService.withdrawingMoney(withdrawingMoneyDto);
  }

  @Post('deposit-money')
  @ApiResponse({
    description: 'Transaction not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Transaction access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Transaction returned successfully',
    type: ResponseMenssageOK,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async depositMoney(
    @Body() depositMoneyDto: DepositMoneyDto,
  ): Promise<ResponseMenssageOK> {
    return await this.transactionService.depositMoney(depositMoneyDto);
  }

  @Post('transfer-money')
  @ApiResponse({
    description: 'Transaction not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Transaction access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Transaction returned successfully',
    type: ResponseMenssageOK,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async transferMoney(
    @Body() transferMoneyDto: TransferMoneyDto,
  ): Promise<ResponseMenssageOK> {
    return await this.transactionService.transferMoney(transferMoneyDto);
  }
}

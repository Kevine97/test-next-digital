import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../db/entity/account.entity';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('api/v1/account')
@ApiTags('api/v1/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  @ApiResponse({
    description: 'Account not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Account access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Account returned successfully',
    type: Account,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createAccount(@Body() newAccount: Account): Promise<Account> {
    return await this.accountService.createAccount(newAccount);
  }
  @Get()
  @ApiResponse({
    description: 'Candidate not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Candidate access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Candidate returned successfully',
    type: Account,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getAllAccount(): Promise<Account[]> {
    return await this.accountService.getAllAccount();
  }

  @Get(':iban')
  @ApiResponse({
    description: 'Candidate not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Candidate access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Candidate returned successfully',
    type: Account,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getAccountByIban(@Param('iban') iban: string): Promise<Account> {
    return await this.accountService.getAccountByIban(iban);
  }
}

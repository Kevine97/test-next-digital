import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../db/entity/account.entity';

@Controller('api/v1/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  async createAccount(@Body() newAccount: Account): Promise<Account> {
    return await this.accountService.createAccount(newAccount);
  }
  @Get()
  async getAllAccount(): Promise<Account[]> {
    return await this.accountService.getAllAccount();
  }

  @Get(':iban')
  async getAccountByIban(@Param('iban') iban: string): Promise<Account> {
    return await this.accountService.getAccountByIban(iban);
  }
}

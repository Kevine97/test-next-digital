import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../db/entity/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async createAccount(account: Account): Promise<Account> {
    try {
      const verifyIban = await this.accountRepository.findOne({
        where: { iban: account.iban },
      });

      if (verifyIban)
        throw new HttpException(
          `The IBAN:${verifyIban.iban} number is already registered`,
          HttpStatus.CONFLICT,
        );

      account.createdAt = Date.now().toLocaleString();
      const creaateAccount = this.accountRepository.create(account);
      const saveAccount = await this.accountRepository.save(creaateAccount);
      return saveAccount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAccountByIban(iban: string): Promise<Account> {
    try {
      const verifyIban = await this.accountRepository.findOne({
        where: { iban },
        relations: ['cards', 'transactions'],
      });

      if (!verifyIban) throw new ForbiddenException('Account');

      return verifyIban;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllAccount(): Promise<Account[]> {
    try {
      const verifyIban = await this.accountRepository.find({
        relations: ['cards', 'transactions'],
      });

      if (!verifyIban) throw new ForbiddenException('Account');

      return verifyIban;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

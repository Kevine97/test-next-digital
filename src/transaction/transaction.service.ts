import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/db/entity/account.entity';
import { Card } from 'src/db/entity/card.entity';
import { Transaction } from 'src/db/entity/transaction.entity';
import { Repository } from 'typeorm';
import {
  DepositMoneyDto,
  TransferMoneyDto,
  WithdrawingMoneyDto,
} from './transaction.dto';
import { CardTypeEnum } from 'src/core/enums/card-type.enum';
import { transactionTypeEnum } from 'src/core/enums/transaction-type';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async withdrawingMoney(
    withdrawingMoneyDto: WithdrawingMoneyDto,
  ): Promise<string> {
    try {
      const card = await this.verifyCardIsActive(
        withdrawingMoneyDto.numberCard,
      );

      const cardType = card.cardType;
      //Todo: Suponiendo que se aplica un comision de 5 euros cuando es de diferente banco
      const commission =
        withdrawingMoneyDto.enttity !== card.account.entity ? 5 : 0;

      if (
        cardType === CardTypeEnum.DEBIT &&
        parseFloat(card.account.availableBalance) < withdrawingMoneyDto.amount
      ) {
        throw new HttpException(
          'You do not have a sufficient balance to perform this operation.',
          HttpStatus.CONFLICT,
        );
      }

      if (
        cardType === CardTypeEnum.CREDIT &&
        card.creditLimit < withdrawingMoneyDto.amount
      ) {
        throw new HttpException(
          'You do not have a sufficient balance to perform this operation.',
          HttpStatus.CONFLICT,
        );
      }

      if (withdrawingMoneyDto.amount > card.moneyLimit) {
        throw new HttpException(
          'You do not have a sufficient balance to perform this operation.',
          HttpStatus.CONFLICT,
        );
      }

      const createTrasaction = this.transactionRepository.create({
        account: card.account,
        card: card,
        amount: withdrawingMoneyDto.amount,
        commission,
        type: 'withdrawal' as transactionTypeEnum,
      });

      const saveTransaction =
        await this.transactionRepository.save(createTrasaction);

      const subtractingBalance =
        card.creditLimit - withdrawingMoneyDto.amount - commission;

      cardType === CardTypeEnum.CREDIT
        ? await this.cardRepository.update(
            { cardNumber: card.cardNumber },
            {
              creditLimit: subtractingBalance,
            },
          )
        : await this.accountRepository.update(
            { iban: card.account.iban },
            { availableBalance: subtractingBalance.toString() },
          );

      return 'Money successfully withdrawn';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async depositMoney(depositMoneyDto: DepositMoneyDto): Promise<string> {
    try {
      const card = await this.verifyCardIsActive(depositMoneyDto.numberCard);

      if (card.account.entity !== depositMoneyDto.enttityAtm)
        throw new HttpException(
          'You cannot deposit money in this atm',
          HttpStatus.CONFLICT,
        );

      const createTrasaction = this.transactionRepository.create({
        account: card.account,
        card: card,
        amount: depositMoneyDto.amount,
        type: 'deposit' as transactionTypeEnum,
      });

      const saveTransaction =
        await this.transactionRepository.save(createTrasaction);

      const addCurrentBalance =
        parseFloat(card.account.availableBalance) + depositMoneyDto.amount;
      const depositMoney = await this.accountRepository.update(
        { iban: card.account.iban },
        { availableBalance: addCurrentBalance.toString() },
      );

      return 'Money successfully deposited';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async transferMoney(transferMoneyDto: TransferMoneyDto): Promise<string> {
    try {
      const accountEmiter = await this.accountRepository.findOne({
        where: { iban: transferMoneyDto.ibanEmitter },
      });

      if (!accountEmiter) throw new ForbiddenException('Account Iban Emiter');

      const accountReeceiver = await this.accountRepository.findOne({
        where: { iban: transferMoneyDto.ibanReceiver },
      });

      if (!accountReeceiver)
        throw new ForbiddenException('Account Iban Reeceiver');

      if (transferMoneyDto.amount <= 0)
        throw new HttpException(
          'The amount must be greater than 0',
          HttpStatus.CONFLICT,
        );

      if (transferMoneyDto.amount > parseFloat(accountEmiter.availableBalance))
        throw new HttpException(
          'You do not have a sufficient balance for this transfer.',
          HttpStatus.CONFLICT,
        );

      let commission = 0;

      if (accountEmiter.entity !== accountReeceiver.entity) commission = 5;

      const subtractingBalance =
        parseFloat(accountEmiter.availableBalance) -
        transferMoneyDto.amount -
        commission;

      const updateAccountEmiter = await this.accountRepository.update(
        { iban: accountEmiter.iban },
        {
          availableBalance: subtractingBalance.toString(),
        },
      );

      const addCurrentBalance =
        parseFloat(accountReeceiver.availableBalance) + transferMoneyDto.amount;

      const updateAccountReeceiver = await this.accountRepository.update(
        { iban: accountReeceiver.iban },
        {
          availableBalance: addCurrentBalance.toString(),
        },
      );

      const createTrasaction = this.transactionRepository.create({
        account: accountEmiter,
        amount: transferMoneyDto.amount,
        type: 'transfer' as transactionTypeEnum,
        commission,
      });

      const saveTransaction =
        await this.transactionRepository.save(createTrasaction);

      return 'Transfer successful';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyCardIsActive(cardNumber: string): Promise<Card> {
    try {
      const card = await this.cardRepository.findOne({
        where: { cardNumber },
        relations: ['account'],
      });

      if (!card) throw new ForbiddenException('Card number');

      if (!card.isActive)
        throw new HttpException(
          'You must first activate your card',
          HttpStatus.CONFLICT,
        );
      return card;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

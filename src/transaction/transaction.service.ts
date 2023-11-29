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
import { WithdrawingMoneyDto } from './transaction.dto';
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

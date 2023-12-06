import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from '../db/entity/card.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from 'src/db/entity/account.entity';
import {
  ChangePinDto,
  CreateCardDto,
  ModifyConfigurationDto,
  ResponseMenssageOK,
} from './card.dto';
import { AccountService } from '../account/account.service';
import { CardTypeEnum } from 'src/core/enums/card-type.enum';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private accountService: AccountService,
  ) {}

  async createCard(card: CreateCardDto): Promise<ResponseMenssageOK> {
    try {
      const verifyNumberCard = await this.cardRepository.findOne({
        where: { cardNumber: card.cardNumber },
      });

      if (verifyNumberCard)
        throw new HttpException(
          `The number card:${card.cardNumber} number is already registered`,
          HttpStatus.CONFLICT,
        );

      if (
        card.moneyLimit < parseInt(MoneyLimitEnum.MIN) ||
        card.moneyLimit > parseInt(MoneyLimitEnum.MAX)
      ) {
        throw new HttpException(
          'The money limit must be between 500 and 6000.',
          HttpStatus.CONFLICT,
        );
      }

      const account = await this.accountService.getAccountByIban(card.iban);

      const encryptPin = await bcrypt.hash(card.cardNumber, 10);
      const encryptCvv = await bcrypt.hash(card.cvv, 10);
      const cardType = card.cardType as CardTypeEnum;

      const creditLimit =
        card.cardType === CardTypeEnum.CREDIT ? card.creditLimit : null;

      const createCard = this.cardRepository.create({
        cardNumber: card.cardNumber,
        cvv: encryptCvv,
        moneyLimit: card.moneyLimit,
        pin: encryptPin,
        account,
        creditLimit,
        cardType,
      });

      const saveCard = await this.cardRepository.save(createCard);
      return {
        msg: 'ResponseMenssageOK',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCardByNumber(cardNumber: string): Promise<Card> {
    try {
      const verifyNumberCard = await this.cardRepository.findOne({
        where: { cardNumber },
        relations: ['account', 'transactions'],
      });

      if (!verifyNumberCard) throw new ForbiddenException('Card number');

      return verifyNumberCard;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async activeCardByNumber(cardNumber: string): Promise<ResponseMenssageOK> {
    try {
      const verifyNumberCard = await this.cardRepository.findOne({
        where: { cardNumber },
      });

      if (!verifyNumberCard) throw new ForbiddenException('Card number');

      const activeCard = await this.cardRepository.update(
        {
          cardNumber,
        },
        {
          isActive: true,
        },
      );

      console.log(activeCard);

      return {
        msg: 'Card successfully activated',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changePin(
    cardNumber: string,
    pins: ChangePinDto,
  ): Promise<ResponseMenssageOK> {
    try {
      const verifyNumberCard = await this.cardRepository.findOne({
        where: { cardNumber },
      });

      if (!verifyNumberCard) throw new ForbiddenException('Card number');

      if (!verifyNumberCard.isActive)
        throw new HttpException(
          'You must first activate your card',
          HttpStatus.CONFLICT,
        );

      const comparePin = await bcrypt.compare(
        pins.currentPin,
        verifyNumberCard.pin,
      );
      if (!comparePin)
        throw new HttpException('incorrect pin', HttpStatus.CONFLICT);

      pins.newPin = await bcrypt.hash(pins.newPin, 10);

      const updateNewPin = await this.cardRepository.update(
        {
          cardNumber,
        },
        {
          pin: pins.newPin,
        },
      );

      return {
        msg: 'Pin successfully changed',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async modifyConfiguration(
    cardNumber: string,
    modifyConfiguration: ModifyConfigurationDto,
  ): Promise<ResponseMenssageOK> {
    try {
      const verifyNumberCard = await this.cardRepository.findOne({
        where: { cardNumber },
      });

      if (!verifyNumberCard) throw new ForbiddenException('Card number');

      if (!verifyNumberCard.isActive)
        throw new HttpException(
          'You must first activate your card',
          HttpStatus.CONFLICT,
        );
      console.log(
        modifyConfiguration.moneyLimit.toString() + ' ' + MoneyLimitEnum.MAX,
      );
      console.log(
        modifyConfiguration.moneyLimit > parseFloat(MoneyLimitEnum.MAX),
      );

      if (
        modifyConfiguration.moneyLimit < parseInt(MoneyLimitEnum.MIN) ||
        modifyConfiguration.moneyLimit > parseInt(MoneyLimitEnum.MAX)
      ) {
        throw new HttpException(
          'The money limit must be between 500 and 6000.',
          HttpStatus.CONFLICT,
        );
      }

      const updateConfiguration = await this.cardRepository.update(
        { cardNumber },
        {
          moneyLimit: modifyConfiguration.moneyLimit,
        },
      );

      return {
        msg: ' Account successfully configured',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

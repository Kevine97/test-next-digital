import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CardService } from './card.service';
import { Card } from 'src/db/entity/card.entity';
import {
  ChangePinDto,
  CreateCardDto,
  ModifyConfigurationDto,
} from './card.dto';

@Controller('api/v1/card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post()
  async createCard(@Body() newCard: CreateCardDto): Promise<string> {
    return await this.cardService.createCard(newCard);
  }
  @Get(':cardNumber')
  async getAccountByIban(
    @Param('cardNumber') cardNumber: string,
  ): Promise<Card> {
    return await this.cardService.getCardByNumber(cardNumber);
  }

  @Put('change-pin/:cardNumber')
  async changePin(
    @Param('cardNumber') cardNumber: string,
    @Body() changePinDto: ChangePinDto,
  ): Promise<string> {
    return await this.cardService.changePin(cardNumber, changePinDto);
  }

  @Put('modify-configuration/:cardNumber')
  async modifyConfiguration(
    @Param('cardNumber') cardNumber: string,
    @Body() modifyConfiguration: ModifyConfigurationDto,
  ): Promise<string> {
    return await this.cardService.modifyConfiguration(
      cardNumber,
      modifyConfiguration,
    );
  }

  @Put('active-card/:cardNumber')
  async activeCard(@Param('cardNumber') cardNumber: string): Promise<string> {
    return await this.cardService.activeCardByNumber(cardNumber);
  }
}

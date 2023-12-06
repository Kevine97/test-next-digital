import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CardService } from './card.service';
import { Card } from 'src/db/entity/card.entity';
import {
  ChangePinDto,
  CreateCardDto,
  ModifyConfigurationDto,
  ResponseMenssageOK,
} from './card.dto';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('api/v1/card')
@ApiTags('api/v1/card')
export class CardController {
  constructor(private cardService: CardService) {}

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
    type: ResponseMenssageOK,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createCard(
    @Body() newCard: CreateCardDto,
  ): Promise<ResponseMenssageOK> {
    return await this.cardService.createCard(newCard);
  }

  @Get(':cardNumber')
  @ApiResponse({
    description: 'Card not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Card access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Card returned successfully',
    type: Card,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getAccountByIban(
    @Param('cardNumber') cardNumber: string,
  ): Promise<Card> {
    return await this.cardService.getCardByNumber(cardNumber);
  }

  @Put('change-pin/:cardNumber')
  @ApiResponse({
    description: 'Pin not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Pin access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Pin returned successfully',
    type: ResponseMenssageOK,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async changePin(
    @Param('cardNumber') cardNumber: string,
    @Body() changePinDto: ChangePinDto,
  ): Promise<ResponseMenssageOK> {
    return await this.cardService.changePin(cardNumber, changePinDto);
  }

  @Put('modify-configuration/:cardNumber')
  @ApiResponse({
    description: 'Card not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Card access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Card returned successfully',
    type: ResponseMenssageOK,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async modifyConfiguration(
    @Param('cardNumber') cardNumber: string,
    @Body() modifyConfiguration: ModifyConfigurationDto,
  ): Promise<ResponseMenssageOK> {
    return await this.cardService.modifyConfiguration(
      cardNumber,
      modifyConfiguration,
    );
  }

  @Put('active-card/:cardNumber')
  @ApiResponse({
    description: 'Card not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Missing Card access',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiOkResponse({
    description: 'Card returned successfully',
    type: ResponseMenssageOK,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async activeCard(
    @Param('cardNumber') cardNumber: string,
  ): Promise<ResponseMenssageOK> {
    return await this.cardService.activeCardByNumber(cardNumber);
  }
}

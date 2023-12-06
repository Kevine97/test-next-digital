import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  cardNumber: string;
  @ApiProperty()
  cardType: string;
  @ApiProperty()
  cvv: string;
  @ApiProperty()
  moneyLimit: number;
  @ApiProperty()
  creditLimit: number;
  @ApiProperty()
  iban: string;
}

export class ChangePinDto {
  @ApiProperty()
  currentPin: string;
  @ApiProperty()
  newPin: string;
}

export class ModifyConfigurationDto {
  @ApiProperty()
  moneyLimit: number;
}

export class ResponseMenssageOK {
  @ApiProperty()
  msg: string;
}

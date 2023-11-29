export class CreateCardDto {
  cardNumber: string;
  cardType: string;
  cvv: string;
  moneyLimit: number;
  iban: string;
}

export class ChangePinDto {
  currentPin: string;
  newPin: string;
}

export class ModifyConfigurationDto {
  moneyLimit: number;
}

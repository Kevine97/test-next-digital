import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidIBAN', async: false })
export class IsValidIBAN implements ValidatorConstraintInterface {
  validate(iban: string, _args: ValidationArguments) {
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}$/;

    if (!ibanRegex.test(iban)) {
      return false;
    }
    return true;
  }

  defaultMessage() {
    return 'El IBAN proporcionado no es válido';
  }
}

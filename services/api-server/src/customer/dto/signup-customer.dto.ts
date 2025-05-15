import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsPhoneNumber,

  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

interface PasswordContainer {
  newPassword: string;
  repeatPassword: string;
}

// Custom validator to check if passwords match
@ValidatorConstraint({ name: 'MatchPasswords', async: false })
class MatchPasswords implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const object = args.object as PasswordContainer;
    return object.newPassword === object.repeatPassword;
  }

  defaultMessage() {
    return 'Le password non corrispondono';
  }
}

export class SignupCustomerDTO {
  @IsEmail({}, { message: 'Email non valida' })
  email: string;

  @IsString({ message: 'Il nome è obbligatorio' })
  firstName: string;

  @IsString({ message: 'Il cognome è obbligatorio' })
  lastName: string;

  @IsString()
  @MinLength(8, { message: 'La password deve essere lunga almeno 8 caratteri' })
  @Matches(/(?=.*[a-z])/, {
    message: 'La password deve contenere almeno una lettera minuscola',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'La password deve contenere almeno una lettera maiuscola',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'La password deve contenere almeno un numero',
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'La password deve contenere almeno un simbolo speciale',
  })
  newPassword: string;

  @IsString({ message: 'La conferma della password è obbligatoria' })
  @Validate(MatchPasswords)
  repeatPassword: string;

  @IsPhoneNumber('IT', { message: 'Numero di telefono non valido' })
  phoneNumber: string;
}

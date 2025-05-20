import { Transform, TransformFnParams } from 'class-transformer';
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


// Custom validator to check if passwords match
@ValidatorConstraint({ name: 'MatchPasswords', async: false })
class MatchPasswords implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const object = args.object as SignupCustomerDTO;
    console.log(object)
    return object.password === object.repeatPassword;
  }

  defaultMessage() {
    return 'Le password non corrispondono';
  }
}

export class SignupCustomerDTO {
  @IsEmail({}, { message: 'Email non valida' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;

  @IsString({ message: 'Il nome è obbligatorio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  firstName: string;

  @IsString({ message: 'Il cognome è obbligatorio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
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
  password: string;

  @IsString({ message: 'La conferma della password è obbligatoria' })
  @Validate(MatchPasswords)
  repeatPassword: string;

  @IsPhoneNumber('IT', { message: 'Numero di telefono non valido' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phoneNumber: string;
}

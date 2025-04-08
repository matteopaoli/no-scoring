import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SetupProfileDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsNotEmpty()
  storeDescription: string;

  @IsString()
  @IsNotEmpty()
  storePlaceId: string;

  @IsString()
  @IsNotEmpty()
  storeLocationLat: string;

  @IsString()
  @IsNotEmpty()
  storeLocationLng: string;

  @IsBoolean()
  @IsNotEmpty()
  customerPaysFees: boolean;

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

  @IsOptional()
  @IsString()
  profileImage?: string; // Base64 string or file path/URL

  @IsOptional()
  @IsString()
  storeImage?: string; // Base64 string or file path/URL
}

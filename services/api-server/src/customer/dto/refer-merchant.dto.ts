import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsNumber,
  IsOptional,
} from 'class-validator';


export class ReferMerchantDTO {
  @IsEmail({}, { message: 'Email non valida' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;

  @IsString({ message: 'Il nome è obbligatorio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  refName: string;

  @IsNumber()
  regionId: number;

  @IsNumber()
  businessTypeId: number;

  @IsOptional()
  @IsPhoneNumber('IT', { message: 'Numero di telefono non valido' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phoneNumber: string;

  @IsOptional()
  notes: string;
}

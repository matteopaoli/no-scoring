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
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @IsString({ message: 'Il nome è obbligatorio' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  refName: string;

  @IsNumber()
  regionId: number;

  @IsNumber()
  businessTypeId: number;

  @IsOptional()
  @IsPhoneNumber('IT', { message: 'Numero di telefono non valido' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  phoneNumber: string;

  @IsOptional()
  notes: string;
}

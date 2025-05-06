import { IsNumber, Min } from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  @Min(1)
  price: number;
}
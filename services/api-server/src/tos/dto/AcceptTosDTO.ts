import { IsNotEmpty, Equals } from 'class-validator';

export class AcceptTosDto {
  @IsNotEmpty({ message: 'Devi accettare i termini e le condizioni per continuare' })
  @Equals('on', { message: 'Devi accettare i termini e le condizioni per continuare' })
  accept!: string;
}
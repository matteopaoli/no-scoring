import { IsOptional, IsString, Matches, MinLength } from "class-validator";

export class UpdateUserDataDto {

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
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
    password?: string;

}
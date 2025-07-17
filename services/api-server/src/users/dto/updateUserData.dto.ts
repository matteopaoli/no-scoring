import { IsOptional, IsString } from "class-validator";

export class UpdateUserDataDto{
    
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
    phoneNumber?:string;
}
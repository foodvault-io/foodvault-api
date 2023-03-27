import {
    IsNotEmpty,
    IsString,
    IsEmail,
} from 'class-validator';

export class LocalSignInDto  { 
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
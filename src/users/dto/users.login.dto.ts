import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
    @IsEmail()
    @IsString()
    email: string;

    password: string;
}

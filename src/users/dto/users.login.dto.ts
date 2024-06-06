import { IsEmail, IsString, Length } from 'class-validator';

export class UserLoginDto {
    @IsEmail()
    @IsString()
    email: string;

    @Length(8)
    @IsString({ message: 'Передана не строка' })
    password: string;
}

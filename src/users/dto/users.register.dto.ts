import { Length, IsString, IsEmail } from 'class-validator';

export class UserRegisterDto {
    @Length(3, 20)
    @IsString()
    name: string;

    @IsEmail()
    @IsString()
    email: string;

    @Length(8)
    @IsString({ message: 'Передана не строка' })
    password: string;
}

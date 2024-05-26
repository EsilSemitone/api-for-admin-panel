import { IsEmail, IsString } from 'class-validator';

export class UserDeleteDto {
    @IsEmail()
    @IsString()
    email: string;
}

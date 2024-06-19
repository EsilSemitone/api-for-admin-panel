import { Type } from 'class-transformer';
import {
    IsEmail,
    IsIn,
    IsString,
    Length,
    ValidateIf,
    ValidateNested,
} from 'class-validator';

const params = {
    name: 'name',
    email: 'email',
    password: 'password',
} as const;

export type UserUpdateDtoParamsTypes = keyof typeof params;

export class DataUpdate {
    @ValidateIf(o => o.name !== undefined)
    @Length(3, 20, { message: 'Имя должно быть длиннее 3 и короче 20 символов' })
    @IsString({ message: 'Передана не строка' })
    name?: string;

    @ValidateIf(o => o.email !== undefined)
    @IsEmail()
    @IsString({ message: 'Передана не строка' })
    email?: string;

    @ValidateIf(o => o.password !== undefined)
    @Length(8)
    @IsString({ message: 'Передана не строка' })
    password?: string;
}

export class UserUpdateDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsIn([...Object.values(params)], { message: 'Передан не верный аргумент' })
    paramName: UserUpdateDtoParamsTypes;

    @ValidateNested({ message: 'Не допустимый формат данных' })
    @Type(() => DataUpdate)
    data: DataUpdate;
}

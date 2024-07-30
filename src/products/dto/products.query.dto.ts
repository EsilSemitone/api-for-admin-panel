import { Type } from 'class-transformer';
import {
    IsIn,
    IsNumber,
    IsNumberString,
    IsString,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { Products, ProductsType } from '../products.types';

class ProductsFilterPrice {
    @ValidateIf(o => o.from !== undefined)
    @IsNumberString()
    from?: string | number;

    @ValidateIf(o => o.to !== undefined)
    @IsNumberString()
    to?: string | number;
}

export class ProductsFilterQueryParams {
    @ValidateIf(o => o.price !== undefined)
    @IsIn(Object.values(Products), {
        message: `Параметр type принимает только следующие значения [${JSON.stringify(Object.values(Products))}]`,
    })
    @IsString()
    type?: ProductsType;

    @ValidateIf(o => o.price !== undefined)
    @ValidateNested({ message: 'Не допустимый формат данных' })
    @Type(() => ProductsFilterPrice)
    price?: ProductsFilterPrice;

    @ValidateIf(o => o.sort !== undefined)
    @IsIn(['createdAt', 'updatedAt'], {
        message: "Параметр sort принимает только следующие значения ['createdAt' | 'updatedAt']",
    })
    date?: 'createdAt' | 'updatedAt';
}

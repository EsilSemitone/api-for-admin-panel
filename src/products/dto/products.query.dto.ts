import { Type } from 'class-transformer';
import { IsIn, IsNotIn, IsNumberString, IsString, Max, Min, min, NotContains, ValidateIf, ValidateNested } from 'class-validator';
import { Products, ProductsType } from '../products.types';
import { Prisma } from '@prisma/client';
import { IsMinThan, IsMoreThan } from '../common/custom-classValidator-decorators';

export type parsePriceReturnType =
    | {
          gte: number | undefined;
          lte: number | undefined;
      }
    | undefined;

export class ProductsFilterPrice {
    @ValidateIf(o => o.from !== undefined)
    @IsNumberString()
    from?: number;

    @ValidateIf(o => o.to !== undefined)
    @IsNumberString()
    to?: number;
}

export class ProductsFilterQueryParams {
    @IsNumberString()
    @IsMoreThan(-1)
    page?: number;
    
    @IsNumberString()
    @IsMinThan(101)
    @IsMoreThan(0)
    size?: number;

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
    sortByDate?: 'createdAt' | 'updatedAt';

    static parseSortByDate(
        param: 'createdAt' | 'updatedAt' | undefined,
    ): Prisma.ProductOrderByWithRelationInput {
        if (!param) {
            return {};
        }

        switch (param) {
            case 'createdAt':
                return { createdAt: 'desc' };
            case 'updatedAt':
                return { updatedAt: 'desc' };
        }
    }

    static parsePrice(param: ProductsFilterPrice | undefined): parsePriceReturnType {
        //эти функции нужны потому что на сервер в любом случе вместо числа приходит строка
        if (!param) {
            return undefined;
        }

        param.from ? (param.from = Number(param.from)) : (param.to = Number(param.to));

        return {
            gte: param.from,
            lte: param.to,
        };
    }
}
import { IsString, IsNumber, IsIn, ValidateIf, ValidateNested } from 'class-validator';
import { Products } from '../products.types';
import { Type } from 'class-transformer';
import { Product } from '../entity/product.entity';

export type UpdatedDataParamsType = Partial<
    Pick<Product, 'title' | 'description' | 'price' | 'type'>
>;

export class UpdatedData {
    @ValidateIf(o => o.title !== undefined)
    @IsString()
    title?: string;

    @ValidateIf(o => o.description !== undefined)
    @IsString()
    description?: string;

    @ValidateIf(o => o.price !== undefined)
    @IsNumber()
    price?: number;

    @ValidateIf(o => o.type !== undefined)
    @IsIn(Object.values(Products))
    type?: string;
}

export class ProductUpdateDto {
    @IsNumber()
    id: number;

    @ValidateIf(o => o.price !== undefined)
    @ValidateNested({ message: 'Не допустимый формат данных' })
    @Type(() => UpdatedData)
    updatedData: UpdatedData;
}

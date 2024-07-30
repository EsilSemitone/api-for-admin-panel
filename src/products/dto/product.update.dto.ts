import { IsString, IsNumber, IsIn, ValidateIf } from 'class-validator';
import { Products } from '../products.types';

export class ProductUpdateDto {
    @IsNumber()
    id: number;

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

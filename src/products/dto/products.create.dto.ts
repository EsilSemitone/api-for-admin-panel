import { IsIn, IsNumber, IsString } from 'class-validator';
import { Products } from '../products.types';

export class ProductsCreateDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsIn(Object.values(Products))
    type: string;
}

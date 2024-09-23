import { Roles } from '@prisma/client';
import { ProductsFilterQueryParams } from '../products/dto/products.query.dto';

declare module 'express' {
    export interface Request {
        id?: number;
        role?: Roles[];
        productsFilter?: ProductsFilterQueryParams;
    }
}

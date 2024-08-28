import { ProductsType } from '../products.types';
import { Product as Product_Prisma } from '@prisma/client';

export class Product {
    id: number;
    title: string;
    description: string;
    price: number;
    type: ProductsType;
    createdAt: Date;
    updatedAt: Date;

    constructor({ id, title, description, price, type, createdAt, updatedAt }: Product_Prisma) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.type = type as ProductsType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

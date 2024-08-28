import { ProductsType } from '../products.types';
import { Product } from './product.entity';
import { ProductOfStock } from './product_Of_Stock.entity';

export class ProductAndStock {
    id: number;
    title: string;
    description: string;
    price: number;
    type: ProductsType;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    createdAtStock: Date;
    updatedAtStock: Date;

    constructor(product: Product, stock: ProductOfStock) {
        this.id = product.id;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.type = product.type;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
        this.amount = stock.amount;
        this.createdAtStock = stock.createdAt;
        this.updatedAtStock = stock.updatedAt;
    }
}

import { Stock } from '@prisma/client';

export class ProductOfStock {
    productId: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;

    constructor({ productId, amount, createdAt, updatedAt }: Stock) {
        this.productId = productId;
        this.amount = amount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

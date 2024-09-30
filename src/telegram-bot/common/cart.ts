import { Product } from '../../products/entity/product.entity';
import { MyContext, MyWizardContext } from './context';

export type ProductFromCart = { product: Product; count: number };
export type CartStorage = Array<ProductFromCart>;

export class Cart {
    cart: CartStorage;

    constructor(ctx: MyContext | MyWizardContext) {
        if (!ctx.session.cart) {
            this.cart = [];
        } else {
            this.cart = ctx.session.cart;
        }
    }

    add(product: Product): CartStorage {
        const productIndex = this.findIndexProduct(product.id);

        if (productIndex === -1) {
            this.cart.push({ product, count: 1 });
        } else {
            this.cart[productIndex].count += 1;
        }

        return this.cart;
    }

    clear(): CartStorage {
        this.cart = [];
        return this.cart;
    }

    amountProducts(): number {
        return this.cart.reduce((sum, product) => {
            return sum + product.count;
        }, 0);
    }

    sumPriceProducts(): number {
        return this.cart.reduce((sum, product) => {
            return sum + product.product.price * product.count;
        }, 0);
    }

    private findIndexProduct(productId: number): number {
        return this.cart.findIndex(({ product, count }) => product.id === productId);
    }
}

import { Product } from './product.entity';
import { ProductOfStock } from './product_Of_Stock.entity';

export class ProductAndStock {
    constructor(
        private _product: Product,
        private _stock: ProductOfStock,
    ) {}

    get product(): Product {
        return this._product;
    }
    set product(product: Product) {
        this._product = product;
    }

    get stock(): ProductOfStock {
        return this._stock;
    }
    set stock(stock: ProductOfStock) {
        this._stock = stock;
    }
}

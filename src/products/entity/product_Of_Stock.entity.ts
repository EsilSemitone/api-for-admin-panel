export class ProductOfStock {
    constructor(
        private _productId: number,
        private _amount: number,
        private _createdAt: Date,
        private _updatedAt: Date,
    ) {}

    get productId(): number {
        return this._productId;
    }

    set productId(id: number) {
        this._productId = id;
    }

    get amount(): number {
        return this._amount;
    }

    set amount(amount: number) {
        this._amount = amount;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(date: Date) {
        this._createdAt = date;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    set updatedAt(date: Date) {
        this._updatedAt = date;
    }
}

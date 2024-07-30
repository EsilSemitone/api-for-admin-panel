import { ProductsType } from '../products.types';

export class Product {
    constructor(
        private _id: number,
        private _title: string,
        private _description: string,
        private _price: number,
        private _type: ProductsType,
        private _createdAt: Date,
        private _updatedAt: Date,
    ) {}

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    get price(): number {
        return this._price;
    }

    set price(price: number) {
        this._price = price;
    }

    get type(): ProductsType {
        return this._type;
    }

    set type(type: ProductsType) {
        this._type = type;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(createdAt: Date) {
        this._createdAt = createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
    set updatedAt(updatedAt: Date) {
        this._updatedAt = updatedAt;
    }
}

import { Products } from '../../products/products.types';

export const productSchemas = {
    productsTypes: {
        '@enum': [...Object.keys(Products)],
    },
    product: {
        _id: 1,
        _title: 'Book',
        _description: 'Planner book',
        _price: 200,
        _type: { $ref: '#/components/schemas/productsTypes' },
        _createdAt: '2024-08-11T13:55:59.124Z',
        _updatedAt: '2024-08-11T13:55:59.124Z',
    },
    products: [
        {
            $ref: '#/components/schemas/product',
        },
    ],
    productsOfStock: {
        _productId: 1,
        _amount: 100,
        _createdAt: '2024-08-11T14:07:39.647Z',
        _updatedAt: '2024-08-11T14:07:39.647Z',
    },
    productAndStock: [
        {
            _product: { $ref: '#/components/schemas/product' },
            _stock: { $ref: '#/components/schemas/productsOfStock' },
        },
    ],
    addProduct: {
        productId: 1,
        amount: 100,
    },
    productIdIsNotExist: {
        message: 'Продукта с таким id не существует',
        error: { $ref: '#/components/schemas/productsOfStock' },
    },
    productCreate: {
        title: 'Book',
        description: 'Planner book',
        price: 200,
        type: { $ref: '#/components/schemas/productsTypes' },
    },
    productNameAlreadyExist: {
        message: 'Продукт с таким именем уже существует',
        error: { $ref: '#/components/schemas/productCreate' },
    },
    productDelete: {
        title: 'Book',
    },
    successDelete: {
        message: `Продукт с названием {body.title} удален.`,
    },
    productNameIsNotExist: {
        message: `Продукта с названием {body.title} не существует.`,
    },
    productUpdate: {
        id: 1,
        $title: 'Book',
        $description: 'Planner book',
        $price: 200,
        $type: { $ref: '#/components/schemas/productsTypes' },
    },
    expectedProperty: {
        message: 'Не передан ни один параметр который нужно обновить у продукта',
        error: { $ref: '#/components/schemas/productUpdate' },
    },
    productIdIsNotExist_update: {
        message: `Продукта с id {body.id} не существует.`,
    },
};

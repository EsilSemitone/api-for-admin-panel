import 'reflect-metadata';
import { IProductsService } from '../interfaces/products.service.interface';
import { IProductsRepository } from '../interfaces/products.repository.interface';
import { Container } from 'inversify';
import { TYPES } from '../../injectsTypes';
import { ProductsService } from '../products.service';
import { Product } from '../entity/product.entity';
import { ProductOfStock } from '../entity/product_Of_Stock.entity';
import { ProductUpdateDto, UpdatedData } from '../dto/product.update.dto';

const productRepositoryMock = {
    findByTitle: jest.fn(),
    findById: jest.fn(),
    findAtStock: jest.fn(),
    getAll: jest.fn(),
    getAllByFilter: jest.fn(),
    create: jest.fn(),
    getAllByStock: jest.fn(),
    addByStock: jest.fn(),
    createByStock: jest.fn(),
    softDelete: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
};

let productsService: IProductsService;
let productsRepository: IProductsRepository;

beforeAll(() => {
    const container = new Container();
    container
        .bind<IProductsRepository>(TYPES.productsRepository)
        .toConstantValue(productRepositoryMock);
    container.bind<IProductsService>(TYPES.productsService).to(ProductsService);

    productsService = container.get<IProductsService>(TYPES.productsService);
    productsRepository = container.get<IProductsRepository>(TYPES.productsRepository);
});

const baseProducts = [
    new Product({
        id: 1,
        title: 'Beer',
        description: 'alcohol drink',
        price: 100,
        type: 'ALCOHOL',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    new Product({
        id: 2,
        title: 'Beer2',
        description: 'alcohol drink2',
        price: 200,
        type: 'ALCOHOL',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
];

const AllProductsByFilter = [baseProducts[0]];

describe('product Service', () => {
    it('get all products without filter', async () => {
        productsRepository.getAll = jest.fn().mockReturnValueOnce(baseProducts);
        const result = await productsService.getAll({});
        expect(result).toBe(baseProducts);
    });

    it('get all products', async () => {
        productsRepository.getAllByFilter = jest.fn().mockReturnValueOnce(AllProductsByFilter);
        const result = await productsService.getAll({ type: 'ALCOHOL' });
        expect(result).toBe(AllProductsByFilter);
    });

    it('add products on stock [not product exist]', async () => {
        productsRepository.findById = jest.fn().mockReturnValueOnce(null);

        const result = await productsService.addByStock({ productId: 1, amount: 10 });
        expect(result).toBe(null);
    });
    it('add products on stock [product exist but not found by stock]', async () => {
        productsRepository.findById = jest.fn().mockReturnValueOnce(baseProducts[0]);
        productsRepository.findAtStock = jest.fn().mockReturnValueOnce(null);
        productsRepository.createByStock = jest
            .fn()
            .mockImplementation((productId: number, amount: number) => {
                return new ProductOfStock({
                    id: 1,
                    productId,
                    amount,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            });
        const result = await productsService.addByStock({ productId: 1, amount: 10 });
        expect(result?.amount).toBe(10);
    });

    it('update product', async () => {
        let updateData: UpdatedData;

        productsRepository.findById = jest.fn().mockReturnValueOnce(baseProducts[0]);

        productsRepository.update = jest.fn().mockImplementation((id, data) => {
            updateData = data;
            return baseProducts[0];
        });
        const result = await productsService.update({
            id: 1,
            updatedData: {
                title: 'new_title',
                description: 'new_description',
                price: 200,
                type: 'ALCOHOL',
            },
        });

        expect(Object.keys(updateData!).length).toBe(4);
        expect(updateData!.price).toBe(200);
    });
});

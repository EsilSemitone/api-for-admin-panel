import 'reflect-metadata';
import { IProductsService } from '../interfaces/products.service.interface';
import { IProductsRepository } from '../interfaces/products.repository.interface';
import { Container } from 'inversify';
import { TYPES } from '../../injectsTypes';
import { ProductsService } from '../products.service';
import { Product } from '../entity/product.entity';
import { ProductOfStock } from '../entity/product_Of_Stock.entity';
import { ProductUpdateDto } from '../dto/product.update.dto';

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
    delete: jest.fn(),
    update: jest.fn(),
};

let productsService: IProductsService;
let productsRepository: IProductsRepository;

beforeAll(() => {
    const container = new Container();
    container
        .bind<IProductsRepository>(TYPES.ProductsRepository)
        .toConstantValue(productRepositoryMock);
    container.bind<IProductsService>(TYPES.ProductsService).to(ProductsService);

    productsService = container.get<IProductsService>(TYPES.ProductsService);
    productsRepository = container.get<IProductsRepository>(TYPES.ProductsRepository);
});

const AllProducts = [
    new Product(1, 'Beer', 'alcohol drink', 100, 'ALCOHOL', new Date(), new Date()),
    new Product(2, 'Beer2', 'alcohol drink2', 200, 'ALCOHOL', new Date(), new Date()),
];

const AllProductsByFilter = [
    new Product(1, 'Beer', 'alcohol drink', 100, 'ALCOHOL', new Date(), new Date()),
];

describe('product Service', () => {
    it('get all products without filter', async () => {
        productsRepository.getAll = jest.fn().mockReturnValueOnce(AllProducts);
        const result = await productsService.getAll();
        expect(result).toBe(AllProducts);
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
        productsRepository.findById = jest
            .fn()
            .mockReturnValueOnce(
                new Product(1, 'Beer', 'alcohol drink', 100, 'ALCOHOL', new Date(), new Date()),
            );
        productsRepository.findAtStock = jest.fn().mockReturnValueOnce(null);
        productsRepository.createByStock = jest
            .fn()
            .mockImplementation((productId: number, amount: number) => {
                return new ProductOfStock(productId, amount, new Date(), new Date());
            });
        const result = await productsService.addByStock({ productId: 1, amount: 10 });
        expect(result?.amount).toBe(10);
    });

    it('update product', async () => {
        let updateData: Partial<ProductUpdateDto>;

        productsRepository.findById = jest
            .fn()
            .mockReturnValueOnce(
                new Product(1, 'Beer', 'alcohol drink', 100, 'ALCOHOL', new Date(), new Date()),
            );

        productsRepository.update = jest.fn().mockImplementation((id, data) => {
            updateData = data;
            return new Product(1, 'Beer', 'alcohol drink', 100, 'ALCOHOL', new Date(), new Date());
        });
        const result = await productsService.update({
            id: 1,
            title: 'new_title',
            description: 'new_description',
            price: 200,
        });

        expect(Object.keys(updateData!).length).toBe(3);
        expect(updateData!.price).toBe(200);
    });
});

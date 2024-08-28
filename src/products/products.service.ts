import 'reflect-metadata';
import {
    IProductsService,
    ProductServiceInputParamsAddByStock,
    ProductServiceInputParamsCreate,
    ProductServiceInputParamsDelete,
    ProductServiceInputParamsGetAll,
    ProductServiceInputParamsUpdate,
} from './interfaces/products.service.interface';
import { Product } from './entity/product.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { IProductsRepository } from './interfaces/products.repository.interface';
import { ProductOfStock } from './entity/product_Of_Stock.entity';
import { ProductAndStock } from './entity/product_And_Stock.entity';

@injectable()
export class ProductsService implements IProductsService {
    constructor(
        @inject(TYPES.productsRepository) private productsRepository: IProductsRepository,
    ) {}

    async getAll({ type, price, sortByDate }: ProductServiceInputParamsGetAll): Promise<Product[]> {
        if (!(type || price || sortByDate)) {
            const result = await this.productsRepository.getAll();
            return result;
        }

        const result = await this.productsRepository.getAllByFilter({ type, price, sortByDate });
        return result;
    }

    async getAllByStock(): Promise<ProductAndStock[]> {
        const stock = await this.productsRepository.getAllByStock();
        return stock;
    }

    async addByStock({
        productId,
        amount,
    }: ProductServiceInputParamsAddByStock): Promise<ProductOfStock | null> {
        const isProductExist = await this.productsRepository.findById(productId);

        if (!isProductExist) {
            return null;
        }

        const productAtStock = await this.productsRepository.findAtStock(productId);

        if (!productAtStock) {
            const result = await this.productsRepository.createByStock(productId, amount);

            return result;
        }

        const result = await this.productsRepository.addByStock(
            productId,
            productAtStock.amount + amount,
        );

        return result;
    }

    async create({
        title,
        description,
        price,
        type,
    }: ProductServiceInputParamsCreate): Promise<Product | null> {
        const isProductExist = await this.productsRepository.findByTitle(title);

        if (isProductExist) {
            return null;
        }

        const newProduct = await this.productsRepository.create({
            title,
            description,
            price,
            type,
        });

        return newProduct;
    }

    async delete({ title }: ProductServiceInputParamsDelete): Promise<Product | null> {
        const isProductExist = await this.productsRepository.findByTitle(title);

        if (!isProductExist) {
            return null;
        }

        const deletedProduct = await this.productsRepository.softDelete(title);

        return deletedProduct;
    }

    async update({ id, updatedData }: ProductServiceInputParamsUpdate): Promise<Product | null> {
        const isProductExist = await this.productsRepository.findById(id);

        if (!isProductExist) {
            return null;
        }

        const updatedProduct = await this.productsRepository.update(id, updatedData);

        return updatedProduct;
    }
}

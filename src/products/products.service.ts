import 'reflect-metadata';
import { IProductsService } from './interfaces/products.service.interface';
import { Product } from './entity/product.entity';
import { inject, injectable } from 'inversify';
import { ProductsFilterQueryParams } from './dto/products.query.dto';
import { TYPES } from '../injectsTypes';
import { IProductsRepository } from './interfaces/products.repository.interface';
import { ProductsCreateDto } from './dto/products.create.dto';
import { ProductAddByStockDto } from './dto/product.addByStock.dto';
import { ProductOfStock } from './entity/product_Of_Stock.entity';
import { ProductAndStock } from './entity/product_And_Stock.entity';
import { ProductDeleteDto } from './dto/product.delete.dto';
import { ProductUpdateDto } from './dto/product.update.dto';

@injectable()
export class ProductsService implements IProductsService {
    constructor(
        @inject(TYPES.ProductsRepository) private productsRepository: IProductsRepository,
    ) {}

    async getAll(query?: ProductsFilterQueryParams): Promise<Product[]> {
        if (query === undefined) {
            const result = await this.productsRepository.getAll();
            return result;
        }

        if (Object.keys(query).length === 0) {
            const result = await this.productsRepository.getAll();
            return result;
        }

        const result = await this.productsRepository.getAllByFilter(query);
        return result;
    }

    async getAllByStock(): Promise<ProductAndStock[]> {
        const stock = await this.productsRepository.getAllByStock();
        return stock;
    }

    async addByStock(productAddDto: ProductAddByStockDto): Promise<ProductOfStock | null> {
        const isProductExist = await this.productsRepository.findById(productAddDto.productId);

        if (!isProductExist) {
            return null;
        }

        const productAtStock = await this.productsRepository.findAtStock(productAddDto.productId);

        if (!productAtStock) {
            const result = await this.productsRepository.createByStock(
                productAddDto.productId,
                productAddDto.amount,
            );

            return result;
        }

        const result = await this.productsRepository.addByStock(
            productAddDto.productId,
            productAtStock.amount + productAddDto.amount,
        );

        return result;
    }

    async create(product: ProductsCreateDto): Promise<Product | null> {
        const isProductExist = await this.productsRepository.findByTitle(product.title);

        if (isProductExist) {
            return null;
        }

        const newProduct = await this.productsRepository.create(product);

        return newProduct;
    }

    async delete({ title }: ProductDeleteDto): Promise<boolean> {
        const isProductExist = await this.productsRepository.findByTitle(title);

        if (!isProductExist) {
            return false;
        }

        const isProductDeleted = await this.productsRepository.delete(title);

        return isProductDeleted;
    }

    async update(dto: ProductUpdateDto): Promise<Product | null> {
        const isProductExist = await this.productsRepository.findById(dto.id);

        if (!isProductExist) {
            return null;
        }

        const data: Partial<ProductUpdateDto> = Object.assign({}, dto);
        delete data.id;

        const updatedProduct = await this.productsRepository.update(dto.id, data);

        return updatedProduct;
    }
}

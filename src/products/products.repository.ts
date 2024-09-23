import 'reflect-metadata';
import { IProductsRepository } from './interfaces/products.repository.interface';
import { Product } from './entity/product.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { PrismaService } from '../database/prisma.service';
import { ProductsFilterQueryParams } from './dto/products.query.dto';
import { ProductsCreateDto } from './dto/products.create.dto';
import { ProductAndStock } from './entity/product_And_Stock.entity';
import { ProductOfStock } from './entity/product_Of_Stock.entity';
import { UpdatedData } from './dto/product.update.dto';
import { ProductServiceInputParamsGetAll } from './interfaces/products.service.interface';

@injectable()
export class ProductsRepository implements IProductsRepository {
    constructor(@inject(TYPES.prismaService) private prismaService: PrismaService) {}

    async findByTitle(title: string): Promise<Product | null> {
        const result = await this.prismaService.dbClient.product.findFirst({ where: { title } });
        if (!result) {
            return result;
        }

        return new Product(result);
    }

    async findById(id: number): Promise<Product | null> {
        const product = await this.prismaService.dbClient.product.findFirst({ where: { id } });

        if (!product) {
            return product;
        }

        return new Product(product);
    }

    async findAtStock(productId: number): Promise<ProductOfStock | null> {
        const result = await this.prismaService.dbClient.stock.findFirst({ where: { productId } });

        if (!result) {
            return result;
        }

        return new ProductOfStock(result);
    }

    async getAll(page: number, size: number): Promise<Product[]> {
        const products = await this.prismaService.dbClient.product.findMany({
            skip: size * page,
            take: size,
            where: { isDeleted: false },
        });

        return products.map(product => new Product(product));
    }

    async getAllByFilter(page: number, size: number, {
        type,
        price,
        sortByDate,
    }: Pick<ProductServiceInputParamsGetAll, 'type' | 'price' | 'sortByDate'>): Promise<Product[]> {
        const parseOrderBy = ProductsFilterQueryParams.parseSortByDate(sortByDate);
        const parsePrice = ProductsFilterQueryParams.parsePrice(price);

        const result = await this.prismaService.dbClient.product.findMany({
            skip: size * page,
            take: size,
            where: {
                isDeleted: false,
                type,
                price: parsePrice,
            },
            orderBy: parseOrderBy,
        });
        return result.map(product => {
            return new Product(product);
        });
    }

    async getAllByStock(): Promise<ProductAndStock[]> {
        const result = await this.prismaService.dbClient.stock.findMany({
            select: {
                product: true,
                id: true,
                amount: true,
                productId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const products = result.map(({ product, id, productId, amount, createdAt, updatedAt }) => {
            return new ProductAndStock(
                new Product(product),
                new ProductOfStock({ id, productId, amount, createdAt, updatedAt }),
            );
        });

        return products;
    }

    async create({ title, description, price, type }: ProductsCreateDto): Promise<Product> {
        const newProduct = await this.prismaService.dbClient.product.create({
            data: {
                title,
                description,
                type,
                price,
            },
        });

        return new Product(newProduct);
    }

    async addByStock(productId: number, amount: number): Promise<ProductOfStock> {
        const result = await this.prismaService.dbClient.stock.update({
            where: { productId },
            data: {
                amount,
            },
        });

        return new ProductOfStock(result);
    }

    async createByStock(productId: number, amount: number): Promise<ProductOfStock> {
        const result = await this.prismaService.dbClient.stock.create({
            data: {
                productId,
                amount,
            },
        });

        return new ProductOfStock(result);
    }

    async softDelete(title: string): Promise<Product> {
        const deletedProduct = await this.prismaService.dbClient.product.update({
            where: { title },
            data: {
                isDeleted: true,
            },
        });

        return new Product(deletedProduct);
    }

    async delete(title: string): Promise<Product> {
        //Я решил что правильно будет оставить возможность удаление записей из базы данных
        const result = await this.prismaService.dbClient.product.delete({ where: { title } });
        return new Product(result);
    }

    async update(id: number, data: UpdatedData): Promise<Product> {
        const updatedProduct = await this.prismaService.dbClient.product.update({
            where: { id },
            data,
        });

        return new Product(updatedProduct);
    }
}

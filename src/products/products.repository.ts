import 'reflect-metadata';
import { IProductsRepository } from './interfaces/products.repository.interface';
import { Product } from './entity/product.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { PrismaService } from '../database/prisma.service';
import { ProductsFilterQueryParams } from './dto/products.query.dto';
import { ProductsCreateDto } from './dto/products.create.dto';
import { Prisma, Product as PrismaProduct } from '@prisma/client';
import { ProductsType } from './products.types';
import { ProductAndStock } from './entity/product_And_Stock.entity';
import { ProductOfStock } from './entity/product_Of_Stock.entity';
import { ProductUpdateDto } from './dto/product.update.dto';

@injectable()
export class ProductsRepository implements IProductsRepository {
    constructor(@inject(TYPES.Prisma_Service) private prismaService: PrismaService) {}

    async findByTitle(title: string): Promise<Product | null> {
        const result = await this.prismaService.dbClient.product.findFirst({ where: { title } });
        if (!result) {
            return result;
        }
        const { id, description, price, type, createdAt, updatedAt } = result;
        return new Product(
            id,
            title,
            description,
            price,
            type as ProductsType,
            createdAt,
            updatedAt,
        );
    }

    async findById(id: number): Promise<Product | null> {
        const product = await this.prismaService.dbClient.product.findFirst({ where: { id } });

        if (!product) {
            return product;
        }

        const { title, description, price, type, createdAt, updatedAt } = product;

        return new Product(
            id,
            title,
            description,
            price,
            type as ProductsType,
            createdAt,
            updatedAt,
        );
    }

    async findAtStock(productId: number): Promise<ProductOfStock | null> {
        const result = await this.prismaService.dbClient.stock.findFirst({ where: { productId } });

        if (!result) {
            return result;
        }

        const { amount, createdAt, updatedAt } = result;

        return new ProductOfStock(productId, amount, createdAt, updatedAt);
    }

    async getAll(): Promise<Product[]> {
        const products = await this.prismaService.dbClient.product.findMany();

        return products.map(
            ({ id, title, description, price, type, createdAt, updatedAt }) =>
                new Product(
                    id,
                    title,
                    description,
                    price,
                    type as ProductsType,
                    createdAt,
                    updatedAt,
                ),
        );
    }

    constructMainQuery({ type, price, date }: ProductsFilterQueryParams): Prisma.Sql {
        let firstQuery;
        let priceQuery;
        let priceQueryTo;
        let dateQuery;

        let typeValue;
        let priceValueFrom;
        let priceValueTo;
        let dateValue;

        if (type) {
            firstQuery = `SELECT id, title, description, price, type, "createdAt", "updatedAt" FROM "Product" WHERE type = `;
            typeValue = type;
        }

        if (price) {
            if (price.from) {
                typeof price.from === 'string'
                    ? (priceValueFrom = Number.parseInt(price.from))
                    : undefined;

                firstQuery
                    ? (priceQuery = `AND price >= `)
                    : (firstQuery =
                          'SELECT id, title, description, price, type, "createdAt", "updatedAt" FROM "Product" WHERE  price >= ');
                undefined;
            }

            if (price.to) {
                typeof price.to === 'string'
                    ? (priceValueFrom = Number.parseInt(price.to))
                    : undefined;
                priceValueTo = price.to;
                firstQuery
                    ? (priceQueryTo = 'AND price <= ')
                    : (firstQuery =
                          'SELECT id, title, description, price, type, "createdAt", "updatedAt" FROM "Product" WHERE  price <= ');
                undefined;
            }
        }

        if (date) {
            dateValue = date;
            dateQuery = `ORDER BY `;
        }

        const queryArray = [firstQuery, priceQuery, priceQueryTo, dateQuery].filter(
            query => query !== undefined,
        );

        const queryValues = [typeValue, priceValueFrom, priceValueTo, dateValue].filter(
            query => query !== undefined,
        );
        //при компиляции typescript считает что queryArray имеет тип ( string | undefined)[] хотя массив был отсортирован
        return Prisma.sql([...queryArray, ''] as string[], ...queryValues);
    }

    async getAllByFilter(filter: ProductsFilterQueryParams): Promise<Product[]> {
        const mainQuery = this.constructMainQuery(filter);

        const result = await this.prismaService.dbClient.$queryRaw<PrismaProduct[]>(mainQuery);

        return result.map(({ id, title, description, price, type, createdAt, updatedAt }) => {
            return new Product(
                id,
                title,
                description,
                price,
                type as ProductsType,
                createdAt,
                updatedAt,
            );
        });
    }

    async getAllByStock(): Promise<ProductAndStock[]> {
        const result = await this.prismaService.dbClient.stock.findMany({
            select: {
                product: true,
                amount: true,
                productId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const products = result.map(({ product, productId, amount, createdAt, updatedAt }) => {
            return new ProductAndStock(
                new Product(
                    product.id,
                    product.title,
                    product.description,
                    product.price,
                    product.type as ProductsType,
                    product.createdAt,
                    product.updatedAt,
                ),
                new ProductOfStock(productId, amount, createdAt, updatedAt),
            );
        });

        return products;
    }

    async create(product: ProductsCreateDto): Promise<Product> {
        const { id, title, description, price, type, createdAt, updatedAt } =
            await this.prismaService.dbClient.product.create({
                data: {
                    title: product.title,
                    description: product.description,
                    type: product.type,
                    price: product.price,
                },
            });

        return new Product(
            id,
            title,
            description,
            price,
            type as ProductsType,
            createdAt,
            updatedAt,
        );
    }

    async addByStock(productId: number, amount: number): Promise<ProductOfStock> {
        const { createdAt, updatedAt } = await this.prismaService.dbClient.stock.update({
            where: { productId },
            data: {
                amount,
            },
        });

        return new ProductOfStock(productId, amount, createdAt, updatedAt);
    }

    async createByStock(productId: number, amount: number): Promise<ProductOfStock> {
        const { createdAt, updatedAt } = await this.prismaService.dbClient.stock.create({
            data: {
                productId,
                amount,
            },
        });

        return new ProductOfStock(productId, amount, createdAt, updatedAt);
    }

    async delete(title: string): Promise<boolean> {
        const result = await this.prismaService.dbClient.product.delete({ where: { title } });
        return true;
    }

    async update(id: number, data: Omit<ProductUpdateDto, 'id'>): Promise<Product> {
        const { title, description, price, type, createdAt, updatedAt } =
            await this.prismaService.dbClient.product.update({ where: { id }, data });

        return new Product(
            id,
            title,
            description,
            price,
            type as ProductsType,
            createdAt,
            updatedAt,
        );
    }
}

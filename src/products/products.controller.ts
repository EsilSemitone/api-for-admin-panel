import { inject, injectable } from 'inversify';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { TYPES } from '../injectsTypes';
import { IAuthGuardFactory } from '../common/interfaces/auth.guard.factory.interface';
import { NextFunction, Request, Response } from 'express';
import { ValidateQueryFilterMiddleware } from '../common/validate.query.middleware';
import { IProductsService } from './interfaces/products.service.interface';
import { ProductsCreateDto } from './dto/products.create.dto';
import { HttpException } from '../exceptionFilters/http.exception';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ProductAddByStockDto } from './dto/product.addByStock.dto';
import { ProductDeleteDto } from './dto/product.delete.dto';
import { ProductUpdateDto } from './dto/product.update.dto';

@injectable()
export class ProductsController extends Controller implements IController {
    constructor(
        @inject(TYPES.Auth_Guard_Factory) private authGuardFactory: IAuthGuardFactory,
        @inject(TYPES.ProductsService) private productService: IProductsService,
    ) {
        super();

        this.bindRouts([
            {
                path: '/',
                method: 'get',
                func: this.getProducts,
                middlewares: [
                    authGuardFactory.create(['ADMIN']),
                    new ValidateQueryFilterMiddleware(),
                ],
            },
            {
                path: '/stock',
                method: 'get',
                func: this.getProductsOfStock,
                middlewares: [authGuardFactory.create(['GENERAL_WAREHOUSE'])],
            },
            {
                path: '/create',
                method: 'post',
                func: this.create,
                middlewares: [
                    authGuardFactory.create(['ADMIN']),
                    new ValidateMiddleware(ProductsCreateDto),
                ],
            },
            {
                path: '/add',
                method: 'post',
                func: this.addProductsOfStock,
                middlewares: [
                    authGuardFactory.create(['GENERAL_WAREHOUSE']),
                    new ValidateMiddleware(ProductAddByStockDto),
                ],
            },
            {
                path: '/delete',
                method: 'delete',
                func: this.delete,
                middlewares: [
                    authGuardFactory.create(['ADMIN']),
                    new ValidateMiddleware(ProductDeleteDto),
                ],
            },
            {
                path: '/update',
                method: 'patch',
                func: this.update,
                middlewares: [
                    authGuardFactory.create(['ADMIN']),
                    new ValidateMiddleware(ProductUpdateDto),
                ],
            },
        ]);
    }

    async getProducts(
        { productsFilter }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const products = await this.productService.getAll(productsFilter);

        this.ok(res, JSON.stringify(products));
    }

    async getProductsOfStock(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.productService.getAllByStock();
        this.ok(res, result);
    }

    async addProductsOfStock(
        { body }: Request<{}, {}, ProductAddByStockDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.productService.addByStock(body);

        if (!result) {
            return next(new HttpException('Продукта с таким id не существует', 404, body));
        }

        this.ok(res, result);
    }

    async create(
        { body }: Request<{}, {}, ProductsCreateDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.productService.create(body);

        if (!result) {
            return next(
                new HttpException(
                    'Продукт с таким именем уже существует',
                    400,
                    JSON.stringify(body),
                ),
            );
        }

        this.ok(res, result);
    }
    async delete(
        { body }: Request<{}, {}, ProductDeleteDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        const result = await this.productService.delete(body);

        if (!result) {
            return this.notFound(res, `Продукта с названием ${body.title} не существует.`);
        }

        this.ok(res, `Продукт с названием ${body.title} удален.`);
    }
    async update(
        { body }: Request<{}, {}, ProductUpdateDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        if (Object.keys(body).length < 2) {
            return next(
                new HttpException(
                    'Не передан ни один параметр который нужно обновить у продукта',
                    400,
                    body,
                ),
            );
        }

        const result = await this.productService.update(body);

        if (!result) {
            return this.notFound(res, `Продукта с id ${body.id} не существует.`);
        }

        this.ok(res, result);
    }
}

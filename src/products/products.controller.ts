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
import { ProductsFilterQueryParams } from './dto/products.query.dto';

@injectable()
export class ProductsController extends Controller implements IController {
    constructor(
        @inject(TYPES.authGuardFactory) private authGuardFactory: IAuthGuardFactory,
        @inject(TYPES.productsService) private productService: IProductsService,
    ) {
        super();

        this.bindRouts([
            {
                path: '/',
                method: 'get',
                func: this.getProducts,
                middlewares: [
                    authGuardFactory.create(['ADMIN']),
                    new ValidateQueryFilterMiddleware(ProductsFilterQueryParams),
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
        req: Request<{}, {}, {}, ProductsFilterQueryParams>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        // #swagger.start
        /*
        #swagger.path = '/product/'
        #swagger.method = 'get'
        #swagger.description = 'Get all products.'
        #swagger.tags = ['Product']
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: "Get all products",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/products",
                    }
                }           
            }
        }   
        #swagger.responses[403] = {
            description: "Failed authorization",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/authorizationError",            
                    },
                }           
            }
        }
        #swagger.end
        */
        const products = await this.productService.getAll(req.query);
        this.ok(res, products);
    }

    async getProductsOfStock(req: Request, res: Response, next: NextFunction): Promise<void> {
        // #swagger.start
        /*
        #swagger.path = '/product/stock'
        #swagger.method = 'get'
        #swagger.description = 'Get all products by stock.'
        #swagger.tags = ['Product']
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: "Get all products by stock",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/productAndStock",
                    }
                }           
            }
        }   
        #swagger.responses[403] = {
            description: "Failed authorization",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/authorizationError",            
                    },
                }           
            }
        }
        #swagger.end
        */
        const result = await this.productService.getAllByStock();
        this.ok(res, result);
    }

    async addProductsOfStock(
        { body }: Request<{}, {}, ProductAddByStockDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        // #swagger.start
        /*
        #swagger.path = '/product/add'
        #swagger.method = 'post'
        #swagger.description = 'Add some amount products of stock.'
        #swagger.tags = ['Product']
        #swagger.security = [{
            "bearerAuth": []
        }]       
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/addProduct"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success added, we get this product info by stock",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/productsOfStock",
                    }
                }           
            }
        }   
        #swagger.responses[403] = {
            description: "Failed authorization",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/authorizationError",            
                    },
                }           
            }
        }
        #swagger.responses[404] = {
            description: "Failed search product by id",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/productIdIsNotExist",            
                    },
                }           
            }
        }  
        #swagger.end
        */
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
        // #swagger.start
        /*
        #swagger.path = '/product/create'
        #swagger.method = 'post'
        #swagger.description = 'Create a new product.'
        #swagger.tags = ['Product']
        #swagger.security = [{
            "bearerAuth": []
        }]       
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/productCreate"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success create a new product",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/product",
                    }
                }           
            }
        }   
        #swagger.responses[403] = {
            description: "Failed authorization",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/authorizationError",            
                    },
                }           
            }
        }
        #swagger.responses[400] = {
            description: "Product with this name already exist",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/productIdIsNotExist",            
                    },
                }           
            }
        }  
        #swagger.end
        */
        const result = await this.productService.create(body);

        if (!result) {
            return next(new HttpException('Продукт с таким именем уже существует', 400, body));
        }

        this.ok(res, result);
    }
    async delete(
        { body }: Request<{}, {}, ProductDeleteDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        // #swagger.start
        /*
        #swagger.path = '/product/delete'
        #swagger.method = 'delete'
        #swagger.description = 'Delete product by title.'
        #swagger.tags = ['Product']
        #swagger.security = [{
            "bearerAuth": []
        }]       
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/productDelete"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success delete product",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/successDelete",
                    }
                }           
            }
        }   
        #swagger.responses[403] = {
            description: "Failed authorization",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/authorizationError",            
                    },
                }           
            }
        }
        #swagger.responses[404] = {
            description: "Product with this name is not exist",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/productNameIsNotExist",            
                    },
                }           
            }
        }  
        #swagger.end
        */
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
        // #swagger.start
        /*
        #swagger.path = '/product/update'
        #swagger.method = 'patch'
        #swagger.description = 'Update product property, for example - title.'
        #swagger.tags = ['Product']
        #swagger.security = [{
            "bearerAuth": []
        }]       
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/productUpdate"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success update product property",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/product",
                    }
                }           
            }
        }   
        #swagger.responses[400] = {
            description: "Expected least one property for update",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/expectedProperty",            
                    },
                }           
            }
        }  
        #swagger.responses[403] = {
            description: "Failed authorization",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/authorizationError",            
                    },
                }           
            }
        }
        #swagger.responses[404] = {
            description: "Product with this id is not exist",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/productIdIsNotExist_update",            
                    },
                }           
            }
        }  
        #swagger.end
        */
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

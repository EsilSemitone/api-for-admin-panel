import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptionFilters/http.exception';
import { IMiddleware } from './interfaces/middleware.interface';
import { extractErrors } from './validate.middleware';
import { ProductsFilterQueryParams } from '../products/dto/products.query.dto';

export class ValidateQueryFilterMiddleware implements IMiddleware {
    constructor() {}

    execute(req: Request, res: Response, next: NextFunction): void {
        if (!req.query) {
            return next();
        }

        const instance = plainToClass(ProductsFilterQueryParams, req.query);

        validate(instance).then(errors => {
            if (errors.length > 0) {
                const errorsResult = extractErrors(errors);

                next(new HttpException('На сервер не верно переданы данные', 422, errorsResult));
            } else {
                req.productsFilter = instance;
                next();
            }
        });
    }
}

import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptionFilters/http.exception';
import { IMiddleware } from './interfaces/middleware.interface';
import { extractErrors } from './validate.middleware';

export class ValidateQueryFilterMiddleware implements IMiddleware {
    constructor(private classToValidate: ClassConstructor<object>) {}

    execute({ query }: Request, res: Response, next: NextFunction): void {
        const instance = plainToClass(this.classToValidate, query);

        validate(instance).then(errors => {
            if (errors.length > 0) {
                const errorsResult = extractErrors(errors);
                next(new HttpException('На сервер не верно переданы данные', 422, errorsResult));
            } else {
                next();
            }
        });
    }
}

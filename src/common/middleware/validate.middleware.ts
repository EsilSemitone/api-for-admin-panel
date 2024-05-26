import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpExeption } from '../../exeptionFilters/http.exeption';
import { IMiddleware } from './middleware.interface';

export class ValidateMiddleware implements IMiddleware {
    constructor(private classToValidate: ClassConstructor<object>) {}

    execute({ body }: Request, res: Response, next: NextFunction): void {
        const instance = plainToClass(this.classToValidate, body);

        validate(instance).then(errors => {
            if (errors.length > 0) {
                const errorsArray = errors.map(({ constraints }) => {
                    const res =
                        typeof constraints === 'object'
                            ? Object.values(constraints)
                            : undefined;
                    return res;
                });
                next(
                    new HttpExeption(
                        'На сервер не верно переданы данные',
                        422,
                        errorsArray.join(', '),
                    ),
                );
            } else {
                next();
            }
        });
    }
}

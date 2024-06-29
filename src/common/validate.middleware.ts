import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptionFilters/http.exception';
import { IMiddleware } from './interfaces/middleware.interface';

export class ValidateMiddleware implements IMiddleware {
    constructor(private classToValidate: ClassConstructor<object>) {}

    execute({ body }: Request, res: Response, next: NextFunction): void {
        const instance = plainToClass(this.classToValidate, body);

        validate(instance).then(errors => {
            if (errors.length > 0) {
                const errorsResult = this.extractErrors(errors);

                next(new HttpException('На сервер не верно переданы данные', 422, errorsResult));
            } else {
                next();
            }
        });
    }

    extractErrors(data: ValidationError[]): string {
        const res: string = data
            .map(({ constraints, children }) => {
                const res1 =
                    typeof constraints === 'object' ? Object.values(constraints).join(', ') : '';
                const res2 = typeof children === 'object' ? this.extractErrors(children) : '';
                return res1 + res2;
            })
            .join(', ');

        return res;
    }
}

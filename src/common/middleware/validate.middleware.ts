import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpExeption } from '../../exeptionFilters/http.exeption';
import { IMiddleware } from './middleware.interface';

export class ValidateMiddleware implements IMiddleware {
    constructor(private classToValidate: ClassConstructor<object>) {}

    execute({ body }: Request, res: Response, next: NextFunction): void {
        const instance = plainToClass(this.classToValidate, body);

        validate(instance).then(errors => {
            if (errors.length > 0) {
                const errorsResult = this.extractErrors(errors);

                next(new HttpExeption('На сервер не верно переданы данные', 422, errorsResult));
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

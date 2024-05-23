import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IExeptionsFilters } from './exeptions.filters.interface';
import { NextFunction, Request, Response } from 'express';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';
import { HttpExeption } from './http.exeption';

@injectable()
export class ExeptionsFilters implements IExeptionsFilters {
    constructor(@inject(TYPES.Logger) private logger: ILogger) {}

    execute(
        err: Error | HttpExeption,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        if (err instanceof HttpExeption) {
            this.logger.error(
                `[${err.context}] ${err.message}  ${err.statusCode}`,
            );
            res.status(err.statusCode);
        } else {
            this.logger.error(`${err.message}`);
            res.status(500);
        }
        res.send({ err: err.message });
    }
}

import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IExceptionsFilters } from './exceptions.filters.interface';
import { NextFunction, Request, Response } from 'express';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';
import { HttpException } from './http.exception';

@injectable()
export class ExceptionsFilters implements IExceptionsFilters {
    constructor(@inject(TYPES.Logger) private logger: ILogger) {}

    execute(err: Error | HttpException, req: Request, res: Response, next: NextFunction): void {
        if (err instanceof HttpException) {
            this.logger.error(`[${err.context}] ${err.message}  ${err.statusCode}`);
            res.status(err.statusCode);
            res.send({ message: err.message, error: err.context });
        } else {
            this.logger.error(`${err.message}`);
            res.status(500);
            res.send({ err: err.message });
        }
    }
}

import { NextFunction, Request, Response } from 'express';

export interface IExceptionsFilters {
    execute(err: Error, req: Request, res: Response, next: NextFunction): void;
}

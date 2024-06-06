import { NextFunction, Request, Response } from 'express';

export interface IExeptionsFilters {
    execute(err: Error, req: Request, res: Response, next: NextFunction): void;
}

import { NextFunction, Request, Response } from 'express';

export interface IExeptionsFilters {
    execute(
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void;
}

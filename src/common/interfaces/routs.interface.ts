import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IRout {
    path: string;
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
    func: (req: Request, res: Response, next: NextFunction) => void | Promise<void | Response>;
    middlewares?: IMiddleware[];
}

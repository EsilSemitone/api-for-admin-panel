import { RolesType } from '../../roles/roles';
import { IMiddleware } from './middleware.interface';

export interface IAuthGuardFactory {
    create(role: RolesType[]): IMiddleware;
}

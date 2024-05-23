import 'reflect-metadata';
import { injectable } from 'inversify';
import { ILogger } from './logger.service.interface';
import signale, { Signale } from 'signale';

@injectable()
export class LoggerService implements ILogger {
    logger: Signale;
    constructor() {
        this.logger = signale;
        this.logger.config({ displayDate: true, displayTimestamp: true });
    }

    info(message: string): void {
        this.logger.info(message);
    }

    success(message: string): void {
        this.logger.success(message);
    }

    error(message: string): void {
        this.logger.error(message);
    }
}

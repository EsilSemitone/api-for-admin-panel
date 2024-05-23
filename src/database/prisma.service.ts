import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';

@injectable()
export class PrismaService {
    dbClient: PrismaClient;

    constructor(@inject(TYPES.Logger) private logger: ILogger) {
        this.dbClient = new PrismaClient();
    }

    public async connect(): Promise<void> {
        try {
            await this.dbClient.$connect();
            this.logger.success(
                '[PrismaService]  Соединение с базой данных установлено',
            );
        } catch (e) {
            this.logDBError(e);
        }
    }

    public async disConnect(): Promise<void> {
        try {
            await this.dbClient.$disconnect();
            this.logger.success(
                '[PrismaService]  Успешное отключение от базы данных',
            );
        } catch (e) {
            this.logDBError(e);
        }
    }

    private logDBError(error: unknown): void {
        if (error instanceof Error) {
            this.logger.success(`[PrismaService]  Ошибка ${error.message}`);
        } else {
            this.logger.success(`[PrismaService]  Ошибка ${error}`);
        }
    }
}

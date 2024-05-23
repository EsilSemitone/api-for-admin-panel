import { inject, injectable } from 'inversify';
import { IConfigService } from './config.service.interface';
import { DotenvParseOutput, config } from 'dotenv';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';

@injectable()
export class ConfigService implements IConfigService {
    config: DotenvParseOutput;

    constructor(@inject(TYPES.Logger) private logger: ILogger) {
        const { error, parsed } = config();
        if (error) {
            this.logger.error(
                '[ConfigService] Ошибка загрузки файла конфигураций',
            );
        } else if (parsed) {
            this.config = parsed;
            this.logger.success(
                '[ConfigService] Файл конфигураций успешно загружен',
            );
        }
    }

    get(key: string): string {
        return this.config[key];
    }
}

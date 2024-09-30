import { Telegraf } from 'telegraf';
import { ICommand } from './command.interface';
import { MyContext } from '../common/context';

export abstract class Command implements ICommand {
    constructor(public app: Telegraf<MyContext>) {}

    abstract handle(): Promise<void>;
}

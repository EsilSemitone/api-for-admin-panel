export interface ICommand {
    handle(): Promise<void>;
}

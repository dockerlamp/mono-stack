import { ICommand } from './ICommand';

export interface ICommandHandler {
    name: string;
    handle(command: ICommand): Promise<void>;
}
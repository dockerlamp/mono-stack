import { ICommand } from '../command/ICommand';

export interface ICommandHandler {
    name: string;
    handle(command: ICommand);
}
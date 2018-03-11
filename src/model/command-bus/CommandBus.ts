import { ICommand } from '../command/ICommand';
import { ICommandHandler } from '../command-handler/ICommandHandler';

export class CommandBus {
    private commandHandlers: {[name: string]: ICommandHandler} = {};

    public async sendCommand(command: ICommand) {
        let handler = this.commandHandlers[command.name];
        if (!handler) {
            throw new Error(`Handler for ${command.name} not found.`);
        }
        console.log(`Sending command ${command.name}`);
        await handler.handle(command);
    }

    public registerCommandHandler(handler: ICommandHandler) {
        this.commandHandlers[handler.name] = handler;
        console.log(`Command handler ${handler.name} registered`);
    }
}
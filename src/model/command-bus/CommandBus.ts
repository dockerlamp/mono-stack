import { EventEmitter } from 'events';

import { ICommand } from '../command/ICommand';
import { ICommandHandler } from '../command-handler/ICommandHandler';

export class CommandBus extends EventEmitter {
    private commandHandlers: {[name: string]: ICommandHandler} = {};

    public async sendCommand(command: ICommand) {
        let handler = this.commandHandlers[command.name];
        if (!handler) {
            throw new Error(`Handler for ${command.name} not found.`);
        }
        await handler.handle(command);
    }

    public registerCommandHandler(handler: ICommandHandler) {
        this.commandHandlers[handler.name] = handler;
    }
}
import { EventEmitter } from 'events';

import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';

export class CommandBus {
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter = null) {
        this.eventEmitter = eventEmitter ? eventEmitter : new EventEmitter();
    }

    public async sendCommand(command: ICommand) {
        this.eventEmitter.emit(command.name, command);
    }

    public registerCommandHandler(handler: ICommandHandler) {
        this.eventEmitter.on(handler.name, async (command: ICommand) => {
            await handler.handle(command);
        });
    }
}
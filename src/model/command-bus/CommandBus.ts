import { EventEmitter } from 'events';

import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';

export class CommandBus {
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter = null) {
        this.eventEmitter = eventEmitter ? eventEmitter : new EventEmitter();
    }

    public async sendCommand(command: ICommand) {
        console.log(`Sending command ${command.name}/${command.id}`);
        this.eventEmitter.emit(command.name, command);
    }

    public registerCommandHandler(handler: ICommandHandler) {
        console.log(`Regiserd command ${handler.name}`);
        this.eventEmitter.on(handler.name, async (command: ICommand) => {
            console.log(`Handling command ${command.name}/${command.id}`);
            await handler.handle(command);
        });
    }
}
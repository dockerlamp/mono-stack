import { Service } from 'typedi';
import { EventEmitter } from 'events';

import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';
import { CommandBusFactory } from './CommandBusFactory';

@Service({ factory: [CommandBusFactory, 'create'] })
export class CommandBus {
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public async sendCommand(command: ICommand) {
        console.log(`Sending command ${command.name}/${command.id}`);
        this.eventEmitter.emit(command.name, command);
    }

    public registerCommandHandler(handler: ICommandHandler) {
        console.log(`Regiserd command ${handler.name}`);
        if (this.eventEmitter.listenerCount(handler.name) > 0 ) {
            throw new Error(
                `CommandBus based on event emitter allows only one handler "${handler.name}"`);
        }
        this.eventEmitter.on(handler.name, async (command: ICommand) => {
            console.log(`Handling command ${command.name}/${command.id}`);
            await handler.handle(command);
        });
    }
}
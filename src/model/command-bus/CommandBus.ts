import { Service } from 'typedi';
import { EventEmitter } from 'events';
import * as winston from 'winston';

import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';
import { CommandBusFactory } from './CommandBusFactory';
import { Logger } from '../../common/logger/Logger';

@Service({ factory: [CommandBusFactory, 'create'] })
export class CommandBus {
    private eventEmitter: EventEmitter;

    constructor(@Logger() private logger: winston.Logger) {
        this.eventEmitter = new EventEmitter();
    }

    public async sendCommand(command: ICommand) {
        this.logger.info(`Sending command ${command.name}/${command.id}`);
        this.eventEmitter.emit(command.name, command);
    }

    public registerCommandHandler(handler: ICommandHandler) {
        this.logger.info(`Regiserd command ${handler.name}`);
        if (this.eventEmitter.listenerCount(handler.name) > 0 ) {
            throw new Error(
                `CommandBus based on event emitter allows only one handler "${handler.name}"`);
        }
        this.eventEmitter.on(handler.name, async (command: ICommand) => {
            this.logger.info(`Handling command ${command.name}/${command.id}`);
            await handler.handle(command);
        });
    }
}
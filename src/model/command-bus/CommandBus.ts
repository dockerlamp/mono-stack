import { Service } from 'typedi';
import { EventEmitter } from 'events';

import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';
import { CommandBusFactory } from './CommandBusFactory';
import { Logger } from '../../common/logger/Logger';

@Service({ factory: [CommandBusFactory, 'create'] })
export class CommandBus {
    private logger;
    private eventEmitter: EventEmitter;

    constructor(
        private logging: Logger,
    ) {
        this.eventEmitter = new EventEmitter();
        this.logger = this.logging.getLogger();
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
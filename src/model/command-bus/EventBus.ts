import { EventEmitter } from 'events';
import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';

export class EventBus {
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public async publish(command: ICommand) {
        this.eventEmitter.emit(command.name, command);
    }

    public subscribe(handler: ICommandHandler) {
        this.eventEmitter.on(handler.name, async (command: ICommand) => {
            await handler.handle(command);
        });
    }
}
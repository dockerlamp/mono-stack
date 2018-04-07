import {} from 'jest';
import * as uuid from 'uuid';

import { EventBus } from './EventBus';
import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';

const COMMAND_NAME = 'test';

describe('Event bus', () => {
    let bus: EventBus;

    beforeEach(() => {
        bus = new EventBus();
    });

    it('should allow to receive sent command', async (done) => {
        let command: ICommand = {
            name: COMMAND_NAME,
            id: uuid.v4()
        };
        bus.subscribe({
            name: COMMAND_NAME,
            handle: async (receivedCommand: ICommand) => {
                expect(receivedCommand).toMatchObject(command);
                done();
            }
        });

        await bus.publish(command);
    });

    it('should allow to add second handler the same type', async (done) => {
        jest.setTimeout(100);
        let command: ICommand = {
            name: COMMAND_NAME,
            id: uuid.v4()
        };
        let count = 0;
        bus.subscribe({ name: COMMAND_NAME,
            handle: async (receivedCommand) => {
                expect(receivedCommand).toMatchObject(command);
                if ((++count) === 2) { done(); }
            }
        });
        bus.subscribe({ name: COMMAND_NAME,
            handle: async (receivedCommand) => {
                expect(receivedCommand).toMatchObject(command);
                if ((++count) === 2) { done(); }
            }
        });

        await bus.publish(command);
    });
});
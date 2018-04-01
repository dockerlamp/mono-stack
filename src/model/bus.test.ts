import {} from 'jest';
import * as uuid from 'uuid';

import { CommandBus } from './command-bus/CommandBus';
import { ICommand } from './command-bus/ICommand';
import { ICommandHandler } from './command-bus/ICommandHandler';

const COMMAND_NAME = 'test';

describe('Command bus', () => {
    let bus: CommandBus;

    beforeEach(() => {
        bus = new CommandBus();
    });

    it('should allow to receive sent command', async (done) => {
        let command: ICommand = {
            name: COMMAND_NAME,
            id: uuid.v4()
        };
        bus.registerCommandHandler({
            name: COMMAND_NAME,
            handle: async (receivedCommand: ICommand) => {
                expect(receivedCommand).toMatchObject(command);
                done();
            }
        });

        await bus.sendCommand(command);
    });
});
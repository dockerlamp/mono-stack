// reflect-metadata is required for typedi module
import 'reflect-metadata';
import { Container } from 'typedi';

import {} from 'jest';
import * as uuid from 'uuid';

import { CommandBus } from './CommandBus';
import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';
import { LoggerFactory } from '../../common/logger/LoggerFactory';

const COMMAND_NAME = 'test';

describe('Command bus', () => {
    let bus: CommandBus;
    let logger = Container.get(LoggerFactory).create();

    beforeEach(() => {
        bus = new CommandBus(logger);
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

    it('should throw error when adding second handler the same type', async () => {
        bus.registerCommandHandler({ name: COMMAND_NAME,
            handle: async () => {
                // first handler
            }
        });
        expect(() => {
            bus.registerCommandHandler({ name: COMMAND_NAME,
                handle: async () => {
                    // second handler
                }
            });
        }).toThrowError();
    });
});
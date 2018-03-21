import {} from 'jest';
import * as uuid from 'uuid';

import { CommandBus } from './command-bus/CommandBus';
import { LoginUserHandler } from './command-handler/LoginUserHandler';
import { LoginUserCommand } from './command/LoginUser';
import { UserWriteModel } from './write-model/UserWriteModel';
import { ILoginUserCommand } from './command/ILoginUserCommand';

describe('CQRS', () => {
    let bus: CommandBus;
    let writeModel: UserWriteModel;

    beforeEach(() => {
        // configure command bus
        bus = new CommandBus();
        writeModel = new UserWriteModel();
        let handler = new LoginUserHandler(writeModel);
        bus.registerCommandHandler(handler);
    });

    it('sending loginUser command should call saveUser on write model', async () => {
        let command: ILoginUserCommand = {
            name: 'login-user',
            id: uuid.v4(),
            user: {
                email: 'foo@bar.com',
                firstName: 'John',
                lastName: 'Doe',
                sessionId: uuid.v4(),
                provider: 'github',
                providerUserId: '12ab'
            }
        };

        let user;
        jest.spyOn(writeModel, 'saveUser').mockImplementation((userData) => {
            user = userData;
        });

        await bus.sendCommand(command);
        expect(user).toEqual(command.user);
    });
});
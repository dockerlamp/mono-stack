import {} from 'jest';
import * as uuid from 'uuid';

import { CommandBus } from '../../../src/model/command-bus/CommandBus';
import { LoginUserHandler } from '../../../src/model/user/command-handler/LoginUserHandler';
import { LoginUserCommand } from '../../../src/model/user/command/LoginUser';
import { UserWriteModel } from '../../../src/model/user/write-model/UserWriteModel';
import { UserReadModel } from '../../../src/model/user/read-model/UserReadModel';
import { GetSessionUser } from '../../../src/model/user/query/GetSessionUser';
import { ILoginUserCommand } from '../../../src/model/user/command/ILoginUserCommand';

function delay(milis: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, milis));
}

describe('CQRS', () => {
    let bus: CommandBus;
    let getSessionUserQuery: GetSessionUser;

    beforeEach(() => {
        // configure command bus
        bus = new CommandBus();
        let writeModel: UserWriteModel = new UserWriteModel();
        let handler = new LoginUserHandler(writeModel);
        bus.registerCommandHandler(handler);
        let readModel: UserReadModel = new UserReadModel(writeModel);
        getSessionUserQuery = new GetSessionUser(readModel);
    });

    it('after sending command loginUser query should return logged user', async () => {
        let command: ILoginUserCommand = {
            name: 'login-user',
            id: uuid.v4(),
            user: {
                email: 'foo@bar.com',
                name: 'foobar',
                sessionId: uuid.v4(),
                provider: 'foo-provider',
                providerUserId: 'foo-id'
            }
        };

        await bus.sendCommand(command);
        await delay(25);
        let user = await getSessionUserQuery.query(command.user.sessionId);
        expect(user.email).toEqual(command.user.email);
        expect(user.name).toEqual(command.user.name);
        expect(user.sessionIds).toContainEqual(command.user.sessionId);
    });
});

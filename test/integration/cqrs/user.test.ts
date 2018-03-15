import {} from 'jest';
import * as uuid from 'uuid';

import { CommandBus } from '../../../src/model/command-bus/CommandBus';
import { LoginUserHandler } from '../../../src/model/command-handler/LoginUserHandler';
import { LoginUserCommand } from '../../../src/model/command/LoginUser';
import { UserWriteModel } from '../../../src/model/write-model/UserWriteModel';
import { UserReadModel } from '../../../src/model/read-model/UserReadModel';
import { ILoginUser } from '../../../src/model/command/ILoginUser';
import { GetSessionUser } from '../../../src/model/query/GetSessionUser';

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
        let command: ILoginUser = {
            name: 'login-user',
            id: uuid.v4(),
            user: {
                email: 'foo@bar.com',
                userName: 'John Doe',
                sessionId: uuid.v4()
            }
        };

        await bus.sendCommand(command);
        await delay(25);
        let user = await getSessionUserQuery.query(command.user.sessionId);
        expect(user.email).toEqual(command.user.email);
        expect(user.userName).toEqual(command.user.userName);
        expect(user.sessionIds).toContainEqual(command.user.sessionId);
    });
});

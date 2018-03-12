import { CommandBus } from './command-bus/CommandBus';
import { LoginUserHandler } from './command-handler/LoginUserHandler';
import { LoginUserCommand } from './command/LoginUser';
import { UserWriteModel } from './write-model/UserWriteModel';
import * as uuid from 'uuid';
import { UserReadModel } from './read-model/UserReadModel';
import { ILoginUser } from './command/ILoginUser';

async function test() {
    // configure command bus
    let bus = new CommandBus();
    let writeModel = new UserWriteModel();
    let readModel = new UserReadModel(writeModel);
    let handler = new LoginUserHandler(writeModel);
    bus.registerCommandHandler(handler);

    let sessionId = '12345-123-123';
    let command: ILoginUser = {
        name: 'login-user',
        id: uuid.v4(),
        user: {
            email: 'foo@bar.com',
            userName: 'John Doe',
            sessionId: '12345-123-123'
        }
    };

    await bus.sendCommand(command);
    let command2 = {
        name: 'login-user',
        id: uuid.v4(),
        user: {
            email: 'foo@bar.com',
            userName: 'John Lennon',
            sessionId: '54321-123-123'
        }
    };

    await bus.sendCommand(command2);
    // wait until user returned
    let user = await readModel.getUserBySessionId(command.user.sessionId);
    console.log(`User from read model by session Id=${command.user.sessionId}`, user);
}

test()
    .then(() => console.log('done'))
    .catch((err) => console.error(err));
import { } from 'jest';

function delay(milis: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, milis));
}

describe('CQRS - User login flow', () => {

    it.skip('after sending command loginUser query should return logged user', async () => {
    //     let command: ILoginUserCommand = {
    //         name: 'login-user',
    //         id: uuid.v4(),
    //         user: {
    //             email: 'foo@bar.com',
    //             name: 'foobar',
    //             sessionId: uuid.v4(),
    //             provider: 'foo-provider',
    //             providerUserId: 'foo-id'
    //         }
    //     };

    //     await bus.sendCommand(command);
    //     await delay(25);
    //     let user = await getSessionUserQuery.query(command.user.sessionId);
    //     expect(user.email).toEqual(command.user.email);
    //     expect(user.name).toEqual(command.user.name);
    //     expect(user.sessionIds).toContainEqual(command.user.sessionId);
    });
});

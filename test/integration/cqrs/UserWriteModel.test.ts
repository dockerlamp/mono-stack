import { } from 'jest';
import { Connection } from 'mongoose';
import * as uuid from 'uuid';
import * as _ from 'lodash';

import { MongoFactory } from '../../../src/model/db/MongoFactory';
import { UserWriteModel } from '../../../src/model/user/write-model/UserWriteModel';
import { config } from '../../../src/front/config';
import { ILoginUser } from '../../model/user/command/ILoginUser';

function delay(milis: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, milis));
}

const TEST_DB = 'monostack-test';

describe('CQRS - UserWriteModel', () => {
    let connection: Connection;
    let writeModel: UserWriteModel;
    // let bus: CommandBus;
    // let getSessionUserQuery: GetSessionUser;

    let deleteAll = async () => {
        await connection.collection('write-users').deleteMany({});
    };

    beforeAll(async () => {
        let mongoConfig = _.cloneDeep(config.model.mongodb);
        mongoConfig.database = TEST_DB;
        connection = await MongoFactory.getConnection(mongoConfig);
    });

    beforeEach(async () => {
        // configure command bus
        // bus = new CommandBus();
        writeModel = new UserWriteModel(connection);
        await deleteAll();
        // let handler = new LoginUserHandler(writeModel);
        // bus.registerCommandHandler(handler);
        // let readModel: UserReadModel = new UserReadModel(writeModel);
        // getSessionUserQuery = new GetSessionUser(readModel);
    });

    it.skip('should save new user', async () => {
        let user: ILoginUser = {
            email: 'foo@bar.com',
            name: 'foobar',
            firstName: 'foo',
            lastName: 'bar',
            sessionId: uuid.v4(),
            provider: 'foo-provider',
            providerUserId: 'foo-id'
        };
        await writeModel.saveUser(user);
        let dbUser = await writeModel.getUser(user.provider, user.providerUserId);
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.name).toEqual(user.name);
        expect(dbUser.firstName).toEqual(user.firstName);
        expect(dbUser.lastName).toEqual(user.lastName);
        expect(dbUser.providerIds[user.provider]).toEqual(user.providerUserId);
        expect(dbUser.sessionIds).toHaveLength(1);
        expect(dbUser.sessionIds).toContain(user.sessionId);
    });

    it('should update existing user', async () => {
        let user: ILoginUser = {
            email: 'foo@bar.com',
            name: 'foobar',
            firstName: 'foo',
            lastName: 'bar',
            sessionId: uuid.v4(),
            provider: 'foo-provider',
            providerUserId: 'foo-id'
        };
        await writeModel.saveUser(user);
        let updatedUser: ILoginUser = {
            sessionId: uuid.v4(),
            provider: 'foo-provider',
            providerUserId: 'foo-id',
            name: 'foo bar',
        };
        await writeModel.saveUser(updatedUser);
        let dbUser = await writeModel.getUser(updatedUser.provider, updatedUser.providerUserId);
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.name).toEqual(updatedUser.name);
        expect(dbUser.sessionIds).toHaveLength(2);
        expect(dbUser.sessionIds).toContain(updatedUser.sessionId);
    });

    afterEach(async () => {
        // await deleteAll();
    });

    afterAll(async () => {
        connection.close();
    });

        // it('after sending command loginUser query should return logged user', async () => {
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
        // });
});

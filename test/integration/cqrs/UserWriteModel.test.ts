import { } from 'jest';
import { Connection } from 'mongoose';
import * as _ from 'lodash';

import { MongoFactory } from '../../../src/model/db/MongoFactory';
import { UserWriteModel } from '../../../src/model/user/write-model/UserWriteModel';
import { config } from '../../../src/front/config';
import { ILoginUser } from '../../../src/model/user/command/ILoginUser';
import { EventBus } from '../../../src/model/command-bus/EventBus';
import { IWriteModelUserDocument, IWriteModelUser } from '../../model/user/write-model/types';

function delay(milis: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, milis));
}

const TEST_DB = 'monostack-test';

let user: ILoginUser = {
    email: 'foo@bar.com',
    userName: 'foobar',
    firstName: 'foo',
    lastName: 'bar',
    provider: 'github',
    providerUserId: 'foo-id'
};

describe('CQRS - UserWriteModel', () => {
    let connection: Connection;
    let eventBus: EventBus;
    let writeModel: UserWriteModel;

    let deleteAll = async () => {
        await connection.collection('write-users').deleteMany({});
    };

    beforeAll(async () => {
        let mongoConfig = _.cloneDeep(config.model.mongodb);
        mongoConfig.database = TEST_DB;
        connection = await MongoFactory.getConnection(mongoConfig);
        eventBus = new EventBus();
    });

    beforeEach(async () => {
        writeModel = new UserWriteModel(connection, eventBus);
        await deleteAll();
    });

    let expectDbUserEqualsLoginUser = (dbUser: IWriteModelUserDocument) => {
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.userName).toEqual(user.userName);
        expect(dbUser.firstName).toEqual(user.firstName);
        expect(dbUser.lastName).toEqual(user.lastName);
        expect(dbUser.providerIds[user.provider]).toEqual(user.providerUserId);
    };

    it('should save new user', async () => {
        let dbUser = await writeModel.insertUser(user);
        expectDbUserEqualsLoginUser(dbUser);
    });

    it('should get existing user by provider', async () => {
        await writeModel.insertUser(user);
        let dbUser = await writeModel.getUserByProvider(user.provider, user.providerUserId);
        expectDbUserEqualsLoginUser(dbUser);
    });

    it('should get existing user by email', async () => {
        await writeModel.insertUser(user);
        let dbUser = await writeModel.getUseByEmail(user.email);
        expectDbUserEqualsLoginUser(dbUser);
    });

    it('should update existing user', async () => {
        let insertedUser = await writeModel.insertUser(user);
        let updatedUserData = {
            userName: 'foo bar',
        };
        insertedUser.set(updatedUserData);
        await insertedUser.save();
        let dbUser = await writeModel.getUserByProvider(user.provider, user.providerUserId);
        expect(dbUser.id).toEqual(insertedUser.id);
        expect(dbUser.userName).toEqual(updatedUserData.userName);
    });

    afterEach(async () => {
        await deleteAll();
    });

    afterAll(async () => {
        connection.close();
    });

});

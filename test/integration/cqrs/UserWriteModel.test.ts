import { } from 'jest';
import { Connection } from 'mongoose';
import * as _ from 'lodash';

import { MongoFactory } from '../../../src/model/db/MongoFactory';
import { UserWriteModel } from '../../../src/model/user/write-model/UserWriteModel';
import { config } from '../../../src/front/config';
import { ILoginUser } from '../../model/user/command/ILoginUser';

function delay(milis: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, milis));
}

const TEST_DB = 'monostack-test';

let user: ILoginUser = {
    email: 'foo@bar.com',
    name: 'foobar',
    firstName: 'foo',
    lastName: 'bar',
    provider: 'foo-provider',
    providerUserId: 'foo-id'
};

describe('CQRS - UserWriteModel', () => {
    let connection: Connection;
    let writeModel: UserWriteModel;

    let deleteAll = async () => {
        await connection.collection('write-users').deleteMany({});
    };

    beforeAll(async () => {
        let mongoConfig = _.cloneDeep(config.model.mongodb);
        mongoConfig.database = TEST_DB;
        connection = await MongoFactory.getConnection(mongoConfig);
    });

    beforeEach(async () => {
        writeModel = new UserWriteModel(connection);
        await deleteAll();
    });

    it('should save new user', async () => {
        let dbUser = await writeModel.saveUser(user);
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.name).toEqual(user.name);
        expect(dbUser.firstName).toEqual(user.firstName);
        expect(dbUser.lastName).toEqual(user.lastName);
        expect(dbUser.providerIds[user.provider]).toEqual(user.providerUserId);
    });

    it('should get existing user', async () => {
        await writeModel.saveUser(user);
        let dbUser = await writeModel.getUser(user.provider, user.providerUserId);
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.name).toEqual(user.name);
        expect(dbUser.firstName).toEqual(user.firstName);
        expect(dbUser.lastName).toEqual(user.lastName);
        expect(dbUser.providerIds[user.provider]).toEqual(user.providerUserId);
    });

    it('should update existing user', async () => {
        await writeModel.saveUser(user);
        let updatedUser: ILoginUser = {
            provider: 'foo-provider',
            providerUserId: 'foo-id',
            name: 'foo bar',
        };
        let dbUser = await writeModel.saveUser(updatedUser);
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.name).toEqual(updatedUser.name);
    });

    afterEach(async () => {
        await deleteAll();
    });

    afterAll(async () => {
        connection.close();
    });

});

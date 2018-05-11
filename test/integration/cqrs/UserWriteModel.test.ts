import { } from 'jest';
import { Connection } from 'mongoose';
import * as _ from 'lodash';

import { MongoFactory } from '../../../src/model/db/MongoFactory';
import { UserModel } from '../../../src/model/user/model/UserModel';

import { ILoginUser } from '../../../src/model/user/service/ILoginUser';
import { IWriteModelUserDocument, IWriteModelUser } from '../../model/user/model/types';
import { FrontConfigProvider } from '../../../src/front/config/FrontConfigProvider';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { getTestDbContainer } from '../helpers/getTestDbContainer';

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
    let userModel: UserModel;

    let deleteAll = async () => {
        await connection.collection('users').deleteMany({});
    };

    beforeAll(async () => {
        let testDbContainer = getTestDbContainer();
        userModel = testDbContainer.get(UserModel);
        connection = testDbContainer.get(MongoConnection).getConnection();
        testDbContainer.reset();
    });

    beforeEach(async () => {
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
        let dbUser = await userModel.insertUser(user);
        expectDbUserEqualsLoginUser(dbUser);
    });

    it('should get existing user by provider', async () => {
        await userModel.insertUser(user);
        let dbUser = await userModel.getUserByProvider(user.provider, user.providerUserId);
        expectDbUserEqualsLoginUser(dbUser);
    });

    it('should get existing user by email', async () => {
        await userModel.insertUser(user);
        let dbUser = await userModel.getUseByEmail(user.email);
        expectDbUserEqualsLoginUser(dbUser);
    });

    it('should update existing user', async () => {
        let insertedUser = await userModel.insertUser(user);
        let updatedUserData = {
            userName: 'foo bar',
        };
        insertedUser.set(updatedUserData);
        await insertedUser.save();
        let dbUser = await userModel.getUserByProvider(user.provider, user.providerUserId);
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

import { } from 'jest';
import { Connection } from 'mongoose';
import * as _ from 'lodash';

import { MongoFactory } from '../../../src/model/db/MongoFactory';
import { UserWriteModel } from '../../../src/model/user/write-model/UserWriteModel';
import { config } from '../../../src/front/config';
import { ILoginUser } from '../../../src/model/user/command/ILoginUser';
import { EventBus } from '../../../src/model/command-bus/EventBus';
import { LoginUserHandler } from '../../../src/model/user/command-handler/LoginUserHandler';

const TEST_DB = 'monostack-test';

let user: ILoginUser = {
    email: 'foo@bar.com',
    userName: 'foobar',
    firstName: 'foo',
    lastName: 'bar',
    displayName: 'Foo Bar',
    provider: 'github',
    providerUserId: 'foo-id'
};

let userWithEmptyDataFields: ILoginUser = {
    email: 'foo@bar.com',
    provider: 'github',
    providerUserId: 'foo-id'
};

let userWithChangedAllDatafields: ILoginUser = {
    email: 'foo@bar.com',
    userName: 'foobar-changed',
    firstName: 'foo-changed',
    lastName: 'bar-changed',
    displayName: 'Foo Bar-changed',
    provider: 'github',
    providerUserId: 'foo-id'
};

let userFromOtherProvider: ILoginUser = {
    email: 'foo@bar.com',
    userName: 'foobar',
    firstName: 'foo',
    lastName: 'bar',
    displayName: 'Foo Bar',
    provider: 'google',
    providerUserId: 'bar-id'
};

describe('CQRS - LoginUserHandler', () => {
    let connection: Connection;
    let writeModel: UserWriteModel;
    let loginUserHandler: LoginUserHandler;

    let deleteAll = async () => {
        await connection.collection('write-users').deleteMany({});
    };

    beforeAll(async () => {
        let mongoConfig = _.cloneDeep(config.model.mongodb);
        mongoConfig.database = TEST_DB;
        connection = await MongoFactory.getConnection(mongoConfig);
    });

    beforeEach(async () => {
        let eventBus = new EventBus();
        writeModel = new UserWriteModel(connection, eventBus);
        loginUserHandler = new LoginUserHandler(writeModel);
        await deleteAll();
    });

    it('first login should create new user in db', async () => {
        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: user
        });

        let dbUser = await writeModel.getUserByProvider(user.provider, user.providerUserId);
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.userName).toEqual(user.userName);
        expect(dbUser.firstName).toEqual(user.firstName);
        expect(dbUser.lastName).toEqual(user.lastName);
        expect(dbUser.providerIds[user.provider]).toEqual(user.providerUserId);
    });

    it('second login should return the same user', async () => {
        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: user
        });

        let dbUser = await writeModel.getUserByProvider(user.provider, user.providerUserId);
        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: user
        });
        let dbUser2 = await writeModel.getUserByProvider(user.provider, user.providerUserId);
        expect(dbUser2.id).toEqual(dbUser.id);
    });

    it('second login with different provider but the same email should add provider to existing one', async () => {
        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: user
        });

        let dbUser = await writeModel.getUserByProvider(user.provider, user.providerUserId);
        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: userFromOtherProvider
        });
        let dbUser2 = await writeModel.getUserByProvider(
            userFromOtherProvider.provider, userFromOtherProvider.providerUserId);
        expect(dbUser2).not.toBeNull();
        expect(dbUser2.id).toEqual(dbUser.id);
        expect(dbUser2.providerIds[user.provider]).toEqual(user.providerUserId);
        expect(dbUser2.providerIds[userFromOtherProvider.provider]).toEqual(userFromOtherProvider.providerUserId);
    });

    it('second login should not change defined fields from existing user', async () => {
        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: user
        });
        let dbUser = await writeModel.getUserByProvider(user.provider, user.providerUserId);

        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: userWithChangedAllDatafields
        });
        let dbUser2 = await writeModel.getUserByProvider(
            userWithChangedAllDatafields.provider, userWithChangedAllDatafields.providerUserId);
        expect(dbUser2).not.toBeNull();
        expect(dbUser2.id).toEqual(dbUser.id);
        expect(dbUser2.firstName).toEqual(user.firstName);
        expect(dbUser2.lastName).toEqual(user.lastName);
        expect(dbUser2.userName).toEqual(user.userName);
        expect(dbUser2.displayName).toEqual(user.displayName);
    });

    it('second login should change undefined fields from existing user', async () => {
        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: userWithEmptyDataFields
        });
        let dbUser = await writeModel.getUserByProvider(
            userWithEmptyDataFields.provider, userWithEmptyDataFields.providerUserId);

        await loginUserHandler.handle({
            id: 'id',
            name: 'name',
            payload: userWithChangedAllDatafields
        });
        let dbUser2 = await writeModel.getUserByProvider(
            userWithChangedAllDatafields.provider, userWithChangedAllDatafields.providerUserId);
        expect(dbUser2).not.toBeNull();
        expect(dbUser2.id).toEqual(dbUser.id);
        expect(dbUser2.firstName).toEqual(userWithChangedAllDatafields.firstName);
        expect(dbUser2.lastName).toEqual(userWithChangedAllDatafields.lastName);
        expect(dbUser2.userName).toEqual(userWithChangedAllDatafields.userName);
        expect(dbUser2.displayName).toEqual(userWithChangedAllDatafields.displayName);
    });

    afterEach(async () => {
        // await deleteAll();
    });

    afterAll(async () => {
        connection.close();
    });

});

import { } from 'jest';
import { Connection } from 'mongoose';
import * as _ from 'lodash';

import { UserModel } from '../../../src/model/user/model/UserModel';
import { ILoginUser } from '../../../src/model/user/service/ILoginUser';
import { getTestDbContainer } from '../helpers/getTestDbContainer';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { UserService } from '../../../src/model/user/service/UserService';

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

describe('UserService', () => {
    let connection: Connection;
    let userService: UserService;
    let testDbContainer;

    let deleteAll = async () => {
        let result = await connection.collection('users').deleteMany({});
    };

    beforeAll(async () => {
        testDbContainer = getTestDbContainer();
        userService = testDbContainer.get(UserService);
        connection = testDbContainer.get(MongoConnection).getConnection();
    });

    beforeEach(async () => {
        await deleteAll();
    });

    it('first login should create new user in db', async () => {
        let dbUser = await userService.login(user);

        expect(dbUser).not.toBeNull();
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.userName).toEqual(user.userName);
        expect(dbUser.firstName).toEqual(user.firstName);
        expect(dbUser.lastName).toEqual(user.lastName);
        expect(dbUser.providerIds[user.provider]).toEqual(user.providerUserId);
    });

    it('user can by found by provider id', async () => {
        await userService.login(user);
        let dbUser = await userService.getUserByProvider(user.provider, user.providerUserId);

        expect(dbUser).not.toBeNull();
        expect(dbUser.email).toEqual(user.email);
        expect(dbUser.userName).toEqual(user.userName);
        expect(dbUser.firstName).toEqual(user.firstName);
        expect(dbUser.lastName).toEqual(user.lastName);
        expect(dbUser.providerIds[user.provider]).toEqual(user.providerUserId);
    });

    it('second login should return the same user', async () => {
        let dbUser = await userService.login(user);
        let dbUser2 = await userService.login(user);
        expect(dbUser2.id).toEqual(dbUser.id);
    });

    it('second login with different provider but the same email should add provider to existing one', async () => {
        let dbUser = await userService.login(user);
        let dbUser2 = await userService.login(userFromOtherProvider);

        expect(dbUser2).not.toBeNull();
        expect(dbUser2.id).toEqual(dbUser.id);
        expect(dbUser2.providerIds[user.provider]).toEqual(user.providerUserId);
        expect(dbUser2.providerIds[userFromOtherProvider.provider]).toEqual(userFromOtherProvider.providerUserId);
    });

    it('second login should not change defined fields from existing user', async () => {
        let dbUser = await userService.login(user);
        let dbUser2 = await userService.login(userWithChangedAllDatafields);

        expect(dbUser2).not.toBeNull();
        expect(dbUser2.id).toEqual(dbUser.id);
        expect(dbUser2.firstName).toEqual(user.firstName);
        expect(dbUser2.lastName).toEqual(user.lastName);
        expect(dbUser2.userName).toEqual(user.userName);
        expect(dbUser2.displayName).toEqual(user.displayName);
    });

    it('second login should change undefined fields from existing user', async () => {
        let dbUser = await userService.login(userWithEmptyDataFields);
        let dbUser2 = await userService.login(userWithChangedAllDatafields);

        expect(dbUser2).not.toBeNull();
        expect(dbUser2.id).toEqual(dbUser.id);
        expect(dbUser2.firstName).toEqual(userWithChangedAllDatafields.firstName);
        expect(dbUser2.lastName).toEqual(userWithChangedAllDatafields.lastName);
        expect(dbUser2.userName).toEqual(userWithChangedAllDatafields.userName);
        expect(dbUser2.displayName).toEqual(userWithChangedAllDatafields.displayName);
    });

    afterEach(async () => {
        await deleteAll();
    });

    afterAll(async () => {
        await connection.close();
        testDbContainer.reset();
    });

});

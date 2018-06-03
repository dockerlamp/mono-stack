import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { removeParents } from '../../../test/integration/helpers/removeParents';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { COMPONENT_COLLECTION } from '../../../src/model/db/StackRepository';

import { Stack } from './Stack';
import { StackService } from './StackService';
import { ComponentType } from './interface/ComponentType';
import { Component } from './Component';
import { ILoginUser } from '../../model/user/service/ILoginUser';
import { UserService } from '../../model/user/service/UserService';

let user: ILoginUser = {
    email: 'foo@bar.com',
    userName: 'foobar',
    firstName: 'foo',
    lastName: 'bar',
    displayName: 'Foo Bar',
    provider: 'github',
    providerUserId: 'foo-id'
};

let stack = new Stack({
    type: ComponentType.Stack,
    children: [
        new Component({
            type: ComponentType.Service,
        }),
    ],
});

describe('StackService', () => {
    let testDbContainer;
    let connection;

    let stackService: StackService;
    let userService: UserService;

    // @ TODO make as helper (same code in StackRepository test)
    let compare = (firstComponent, secondComponent) => {
        // eliminate circular references for compare
        removeParents(firstComponent);
        removeParents(secondComponent);
        // eliminate specific attribues added by mongoose for compare
        let attributes = ['__v', '_id', '$setOnInsert'];

        expect(_.omit(firstComponent, attributes)).toMatchObject(
            _.omit(secondComponent, attributes));
        expect(_.omit(secondComponent, attributes)).toMatchObject(
            _.omit(firstComponent, attributes));
    };

    beforeAll(async () => {
        testDbContainer = getTestDbContainer();
        connection = testDbContainer.get(MongoConnection).getConnection();
        stackService = testDbContainer.get(StackService);
        userService = testDbContainer.get(UserService);
        testDbContainer.reset();
    });

    beforeEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    afterEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    it('should add anonymous stack', async () => {
        let copiedStack = _.cloneDeep(stack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toBeUndefined();
        let anonymousStack = await stackService.addAnonymous(copiedStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('added anonymous stack should be same as before adding', async () => {
        let copiedStack = _.cloneDeep(stack);
        let anonymousStack = await stackService.addAnonymous(copiedStack);
        expect(anonymousStack).toBeInstanceOf(Stack);
        compare(copiedStack, anonymousStack);
    });

    it('should add signed stack for proper user', async () => {
        let loggedUser = await userService.login(user);
        let signedStack = _.cloneDeep(stack);
        signedStack.user = loggedUser;

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
        let addedStack = await stackService.add(signedStack, loggedUser);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should not add signed stack for wrong user', async () => {
        let loggedUser = await userService.login(user);
        let wrongUser = _.cloneDeep(loggedUser);
        wrongUser._id = 'wrong-user-id';

        let signedStack = _.cloneDeep(stack);
        signedStack.user = loggedUser;

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
        await expect(stackService.add(signedStack, wrongUser)).rejects.toBeInstanceOf(Error);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
    });
});

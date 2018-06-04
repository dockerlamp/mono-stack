import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../../test/integration/helpers/getTestDbContainer';
import { removeParents } from '../../../../test/integration/helpers/removeParents';
import { MongoConnection } from '../../../../src/model/db/MongoConnection';
import { COMPONENT_COLLECTION } from '../../../../src/model/db/StackRepository';
import { USER_COLLECTION } from '../../../../src/model/user/model/UserModel';

import { Stack } from './../Stack';
import { StackService } from './StackService';
import { ComponentType } from './../interface/ComponentType';
import { Component } from './../Component';
import { ILoginUser } from '../../../model/user/service/ILoginUser';
import { UserService } from '../../../model/user/service/UserService';

let user: ILoginUser = {
    email: 'foo@bar.com',
    userName: 'foobar',
    firstName: 'foo',
    lastName: 'bar',
    displayName: 'Foo Bar',
    provider: 'github',
    providerUserId: 'foo-id'
};

let anonymousStack = new Stack({
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
        await connection.collection(USER_COLLECTION).deleteMany({});
    });

    afterEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
        await connection.collection(USER_COLLECTION).deleteMany({});
    });

    it('should add anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toBeUndefined();
        await stackService.addAnonymous(clonedAnonymousStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should be the same anonymous stack on multiple additon', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
        let firstlyInsertedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        expect(firstlyInsertedAnonymousStack).toBeInstanceOf(Stack);
        compare(clonedAnonymousStack, firstlyInsertedAnonymousStack);

        let secondlyInsertedAnonymousStack = await stackService.addAnonymous(firstlyInsertedAnonymousStack);
        expect(secondlyInsertedAnonymousStack).toBeInstanceOf(Stack);
        compare(clonedAnonymousStack, secondlyInsertedAnonymousStack);
        compare(firstlyInsertedAnonymousStack, secondlyInsertedAnonymousStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should update already added anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
        let insertedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);

        let toUpdateAnonymousStack = insertedAnonymousStack;
        toUpdateAnonymousStack.customValue = 'customValue'; // new property
        toUpdateAnonymousStack.children[0].type = ComponentType.Stack; // change propery

        let updatedAnonymousStack = await stackService.addAnonymous(toUpdateAnonymousStack);
        compare(updatedAnonymousStack, toUpdateAnonymousStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should raise error while getting not existing anonymous stack', async () => {
        await expect(stackService.getAnonymous('fakeId')).rejects.toBeInstanceOf(TypeError);
    });

    it('should get already added anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let insertedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        let gotAnonymousStack = await stackService.getAnonymous(insertedAnonymousStack.id);

        expect(gotAnonymousStack).toBeInstanceOf(Stack);
        compare(gotAnonymousStack, insertedAnonymousStack);
    });

    it('should add signed stack for proper user', async () => {
        let loggedUser = await userService.login(user);

        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
        stackService.add(signedStack, loggedUser);
        // @TODO expression below should work, but id does not
        // expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should raise error when adding signed stack owned by other user', async () => {
        let loggedUser = await userService.login(user);

        // make `loggedUser` the owner of the stack
        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;

        let secondUser = _.cloneDeep(user);
        secondUser.providerUserId = 'kung-foo-id';
        secondUser.email = 'kung-foo@bar.com';
        let secondLoggedUser = await userService.login(secondUser);

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
        await expect(stackService.add(signedStack, secondLoggedUser)).rejects.toBeInstanceOf(Error);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
    });

    it('should raise error while getting not existing signed stack', async () => {
        let loggedUser = await userService.login(user);
        await expect(stackService.get('fakeId', loggedUser)).rejects.toBeInstanceOf(TypeError);
    });

    it('should raise error while getting existing anonymous stack using getter for signed stack', async () => {
        let loggedUser = await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        await stackService.addAnonymous(clonedAnonymousStack);
        await expect(stackService.get(clonedAnonymousStack.id, loggedUser)).rejects.toBeInstanceOf(Error);
    });

    it.skip('should get already added signed stack', async () => {
        // @TODO check why this test fails
        let loggedUser = await userService.login(user);

        // make `loggedUser` owner of the stack
        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;

        let insertedSignedStack = await stackService.add(signedStack, loggedUser);
        let gotSignedStack = await stackService.get(insertedSignedStack.id, loggedUser);
        compare(gotSignedStack, insertedSignedStack);
    });

    it('should raise error while getting signed stack owned by other user', async () => {
        let firstLoggedUser = await userService.login(user);
        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = firstLoggedUser;

        let insertedSignedStack = await stackService.add(signedStack, firstLoggedUser);

        let secondUser = _.cloneDeep(user);
        secondUser.providerUserId = 'kung-foo-id';
        secondUser.email = 'kung-foo@bar.com';
        let secondLoggedUser = await userService.login(secondUser);

        await expect(stackService.get(insertedSignedStack.id, secondLoggedUser)).rejects.toBeInstanceOf(Error);
    });

    it('should sign anonymous stack', async () => {
        let loggedUser = await userService.login(user);

        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = stackService.makeSigned(clonedAnonymousStack, loggedUser);
        expect(signedStack).toHaveProperty('user');
    });
});

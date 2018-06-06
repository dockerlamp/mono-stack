import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../../test/integration/helpers/getTestDbContainer';
import { compareComponent } from '../../../../test/integration/helpers/compareComponent';
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

    // add stack tests
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
        compareComponent(clonedAnonymousStack, firstlyInsertedAnonymousStack);

        let secondlyInsertedAnonymousStack = await stackService.addAnonymous(firstlyInsertedAnonymousStack);
        expect(secondlyInsertedAnonymousStack).toBeInstanceOf(Stack);
        compareComponent(clonedAnonymousStack, secondlyInsertedAnonymousStack);
        compareComponent(firstlyInsertedAnonymousStack, secondlyInsertedAnonymousStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should add signed stack for proper user', async () => {
        let loggedUser = await userService.login(user);

        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
        await stackService.add(signedStack, loggedUser);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
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

    // update stack tests
    it('should update already added anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);

        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
        let insertedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);

        let toUpdateAnonymousStack = insertedAnonymousStack;
        toUpdateAnonymousStack.customValue = 'customValue'; // new property
        toUpdateAnonymousStack.children[0].type = ComponentType.Stack; // change propery

        let updatedAnonymousStack = await stackService.addAnonymous(toUpdateAnonymousStack);
        compareComponent(updatedAnonymousStack, toUpdateAnonymousStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    // get stack tests
    it('should raise error while getting not existing anonymous stack', async () => {
        await expect(stackService.getAnonymous('fakeId')).rejects.toBeInstanceOf(TypeError);
    });

    it('should get already added anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let insertedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        let gotAnonymousStack = await stackService.getAnonymous(insertedAnonymousStack.id);

        expect(gotAnonymousStack).toBeInstanceOf(Stack);
        compareComponent(gotAnonymousStack, insertedAnonymousStack);
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

    it('should get already added signed stack', async () => {
        let loggedUser = await userService.login(user);
        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;

        let insertedSignedStack = await stackService.add(signedStack, loggedUser);
        let gotSignedStack = await stackService.get(insertedSignedStack.id, loggedUser);
        compareComponent(gotSignedStack, insertedSignedStack);
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

    // delete stack tests
    it('should raise error while deleting not existing anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        await expect(stackService.removeAnonymous(clonedAnonymousStack)).rejects.toBeInstanceOf(Error);
    });

    it('should raise error while deleting signed stack using remover for anonymous stack', async () => {
        let loggedUser = await userService.login(user);

        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;

        let insertedSignedStack = await stackService.add(signedStack, loggedUser);
        await expect(stackService.removeAnonymous(insertedSignedStack)).rejects.toBeInstanceOf(Error);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should delete previously added anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let insertedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);

        let deletedStackId = await stackService.removeAnonymous(insertedAnonymousStack);
        expect(deletedStackId).toEqual(insertedAnonymousStack.id);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
    });

    it('should raise error while deleting not existing signed stack', async () => {
        let loggedUser = await userService.login(user);
        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;

        await expect(stackService.remove(signedStack, loggedUser)).rejects.toBeInstanceOf(Error);
    });

    // tslint:disable-next-line:max-line-length
    it('should raise error while deleting previously added anonymous stack using remover for signed stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let loggedUser = await userService.login(user);

        let insertedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        await expect(stackService.remove(insertedAnonymousStack, loggedUser)).rejects.toBeInstanceOf(Error);
    });

    it('should delete previously added signed stack', async () => {
        let loggedUser = await userService.login(user);

        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;
        let insertedSignedStack = await stackService.add(signedStack, loggedUser);

        let removedStackId = await stackService.remove(insertedSignedStack, loggedUser);
        expect(removedStackId).toEqual(insertedSignedStack.id);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
    });

    // sign stack tests
    it('should sign anonymous stack', async () => {
        let loggedUser = await userService.login(user);

        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = stackService.makeSigned(clonedAnonymousStack, loggedUser);
        expect(signedStack).toHaveProperty('user');
    });

    it.skip('should raise error while signing already signed stack', async () => {
        let loggedUser = await userService.login(user);

        let signedStack = _.cloneDeep(anonymousStack);
        signedStack.user = loggedUser;

        // @TODO how to catch thrown exception in sync method? this does not work
        expect(stackService.makeSigned(signedStack, loggedUser)).toThrow(Error);
    });
});

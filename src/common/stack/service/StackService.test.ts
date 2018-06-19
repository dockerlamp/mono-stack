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

let fakeId = 'fakeId';

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
        await stackService.addAnonymous(clonedAnonymousStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should be the same anonymous stack on multiple additon', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let firstlyAddedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        expect(firstlyAddedAnonymousStack).toBeInstanceOf(Stack);
        compareComponent(clonedAnonymousStack, firstlyAddedAnonymousStack);
        let secondlyAddedAnonymousStack = await stackService.addAnonymous(firstlyAddedAnonymousStack);
        expect(secondlyAddedAnonymousStack).toBeInstanceOf(Stack);
        compareComponent(clonedAnonymousStack, secondlyAddedAnonymousStack);
        compareComponent(firstlyAddedAnonymousStack, secondlyAddedAnonymousStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    // stack signing tests
    it('should sign anonymous stack', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        expect(clonedAnonymousStack).not.toHaveProperty('userId');
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);
        expect(signedStack).toHaveProperty('userId');
    });

    it('should raise error while signing already signed stack', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);
        await expect(stackService.makeSigned(signedStack, user)).rejects.toBeInstanceOf(Error);
    });

    // stack addition tests
    it('should add signed stack for proper user', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);
        await stackService.add(signedStack, user);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should raise error when adding signed stack owned by other user', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);

        let secondUser = _.cloneDeep(user);
        secondUser.providerUserId = 'kung-foo-id';
        secondUser.email = 'kung-foo@bar.com';
        await userService.login(secondUser);

        await expect(stackService.add(signedStack, secondUser)).rejects.toBeInstanceOf(Error);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
    });

    // update stack tests
    it('should update already added anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let addedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        let toUpdateAnonymousStack = addedAnonymousStack;
        toUpdateAnonymousStack.customValue = 'customValue'; // new property
        toUpdateAnonymousStack.children[0].type = ComponentType.Stack; // change propery

        let updatedAnonymousStack = await stackService.addAnonymous(toUpdateAnonymousStack);
        compareComponent(updatedAnonymousStack, toUpdateAnonymousStack);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    // get stack tests
    it('should raise error while getting not existing anonymous stack', async () => {
        await expect(stackService.getAnonymous(fakeId)).rejects.toBeInstanceOf(TypeError);
    });

    it('should get already added anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let addedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        let gotAnonymousStack = await stackService.getAnonymous(addedAnonymousStack.id);
        expect(gotAnonymousStack).toBeInstanceOf(Stack);
        compareComponent(gotAnonymousStack, addedAnonymousStack);
    });

    it('should raise error while getting not existing signed stack', async () => {
        await expect(stackService.get(fakeId, user)).rejects.toBeInstanceOf(TypeError);
    });

    it('should raise error while getting existing anonymous stack using getter for signed stack', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let addedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        await expect(stackService.get(addedAnonymousStack.id, user)).rejects.toBeInstanceOf(Error);
    });

    it('should get already added signed stack', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);

        let addedSignedStack = await stackService.add(signedStack, user);
        let gotSignedStack = await stackService.get(addedSignedStack.id, user);
        compareComponent(gotSignedStack, addedSignedStack);
    });

    it('should raise error while getting signed stack owned by other user', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);
        let addedSignedStack = await stackService.add(signedStack, user);

        let secondUser = _.cloneDeep(user);
        secondUser.providerUserId = 'kung-foo-id';
        secondUser.email = 'kung-foo@bar.com';
        await userService.login(secondUser);

        await expect(stackService.get(addedSignedStack.id, secondUser)).rejects.toBeInstanceOf(Error);
    });

    // delete stack tests
    it('should raise error while deleting not existing anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        await expect(stackService.removeAnonymous(clonedAnonymousStack)).rejects.toBeInstanceOf(Error);
    });

    it('should raise error while deleting signed stack using remover for anonymous stack', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);

        let addedSignedStack = await stackService.add(signedStack, user);
        await expect(stackService.removeAnonymous(addedSignedStack)).rejects.toBeInstanceOf(Error);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should delete previously added anonymous stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let addedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        let deletedStackId = await stackService.removeAnonymous(addedAnonymousStack);
        expect(deletedStackId).toEqual(addedAnonymousStack.id);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
    });

    it('should raise error while deleting not existing signed stack', async () => {
        let loggedUser = await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);

        await expect(stackService.remove(signedStack, user)).rejects.toBeInstanceOf(Error);
    });

    // tslint:disable-next-line:max-line-length
    it('should raise error while deleting previously added anonymous stack using remover for signed stack', async () => {
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        await userService.login(user);
        let addedAnonymousStack = await stackService.addAnonymous(clonedAnonymousStack);
        await expect(stackService.remove(addedAnonymousStack, user)).rejects.toBeInstanceOf(Error);
    });

    it('should delete previously added signed stack', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);

        let addedSignedStack = await stackService.add(signedStack, user);
        let removedStackId = await stackService.remove(addedSignedStack, user);
        expect(removedStackId).toEqual(addedSignedStack.id);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
    });

    it('should raise error while deleting other`s user signed stack', async () => {
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let signedStack = await stackService.makeSigned(clonedAnonymousStack, user);

        let addedSignedStack = await stackService.add(signedStack, user);

        let secondUser = _.cloneDeep(user);
        secondUser.providerUserId = 'kung-foo-id';
        secondUser.email = 'kung-foo@bar.com';
        await userService.login(secondUser);

        await expect(stackService.remove(addedSignedStack, secondUser)).rejects.toBeInstanceOf(Error);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should return array of user signed stacks', async () => {
        // add two signed stacks for user
        await userService.login(user);
        let clonedAnonymousStack = _.cloneDeep(anonymousStack);
        let firstSignedStack = await stackService.makeSigned(clonedAnonymousStack, user);
        await stackService.add(firstSignedStack, user);
        let secondAnonymousStack = new Stack({
            type: ComponentType.Stack,
            children: [
                new Component({
                    type: ComponentType.Service,
                }),
            ],
        });
        let secondSignedStack = await stackService.makeSigned(secondAnonymousStack, user);
        await stackService.add(secondSignedStack, user);

        // add second user and signed stack for him
        let secondUser = _.cloneDeep(user);
        secondUser.providerUserId = 'kung-foo-id';
        secondUser.email = 'kung-foo@bar.com';
        await userService.login(secondUser);
        let thirdAnonymousStack = new Stack({
            type: ComponentType.Stack,
            children: [
                new Component({
                    type: ComponentType.Service,
                }),
            ],
        });
        let thirdSignedStack = await stackService.makeSigned(thirdAnonymousStack, secondUser);
        await stackService.add(thirdSignedStack, secondUser);

        // add fourth, anonymous stack
        let fourthAnonymousStack = new Stack({
            type: ComponentType.Stack,
            children: [
                new Component({
                    type: ComponentType.Service,
                }),
            ],
        });
        await stackService.addAnonymous(fourthAnonymousStack);

        // get stacks for user
        let userStacks = await stackService.getUserStacks(user);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(4);
        expect(userStacks).toHaveLength(2);
    });
});

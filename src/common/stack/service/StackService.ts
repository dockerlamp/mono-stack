import { Service } from 'typedi';
import * as _ from 'lodash';

import { Stack } from './../Stack';
import { IUser } from '../../../model/user/model/IUser-types';
import { StackRepository } from '../../../model/db/StackRepository';

@Service()
export class StackService {

    constructor(private stackRepository: StackRepository) {}

    public async add(stack: Stack, user: IUser): Promise<Stack> {
        if (!stack.user) {
            throw new Error(`stack ${stack.id} is anonymous`);
        }

        // @TODO this comparison does not work !!!
        // _.isEqual(loggedUser.providerIds, insertedSignedStack.user.providerIds)
        if (stack.user.providerIds.github !== user.providerIds.github) {
            // @TODO check email as well?
            throw new Error(`user ${user.userName} is not the owner of stack ${stack.id}`);
        }

        stack = new Stack(await this.stackRepository.insertOrUpdate(stack));
        return stack;
    }

    public async addAnonymous(stack: Stack): Promise<Stack> {
        if (stack.user) {
            throw new Error(`stack ${stack.id} is signed, use 'add' method`);
        }
        stack = new Stack(await this.stackRepository.insertOrUpdate(stack));
        return stack;
    }

    public async remove(stack: Stack, user: IUser): Promise<string> {
        if (!stack.user) {
            throw new Error(`stack ${stack.id} is anonymous, use 'removeAnonymous' method`);
        }
        return await this.stackRepository.delete(stack);
    }

    public async removeAnonymous(stack: Stack): Promise<string> {
        if (stack.user) {
            throw new Error(`stack ${stack.id} is signed, use 'remove' method`);
        }
        return await this.stackRepository.delete(stack);
    }

    public async getUserStackList(user: IUser): Promise<Stack[]> {
        // @ TODO not implemented in repository
        return;
    }

    public async get(stackId: string, user: IUser): Promise<Stack> {
        let stack = new Stack(await this.stackRepository.getById(stackId));
        if (!stack.user) {
            throw new Error(`stack ${stack.id} is anonymous, use 'getAnonymous' method`);
        }

        // @TODO this comparison does not work !!!
        // _.isEqual(loggedUser.providerIds, insertedSignedStack.user.providerIds)
        if (stack.user.providerIds.github !== user.providerIds.github) {
            // @TODO check email as well?
            throw new Error(`user ${user.userName} is not the owner of stack ${stack.id}`);
        }

        return stack;
    }

    public async getAnonymous(stackId: string): Promise<Stack> {
        let stack = new Stack(await this.stackRepository.getById(stackId));
        if (stack.user) {
            throw new Error(`stack ${stack.id} is signed, use 'get' method`);
        }
        return stack;
    }

    public makeSigned(stack: Stack, user: IUser): Stack {
        if (stack.user) {
            throw new Error(`stack ${stack.id} is already signed`);
        }
        stack.user = user;
        return stack;
    }
}
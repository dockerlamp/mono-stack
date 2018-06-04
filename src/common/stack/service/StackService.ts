import { Service } from 'typedi';

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

        if (stack.user._id !== user._id) {
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

    public async remove(stack: Stack, user: IUser): Promise<void> {
        // @ TODO not implemented in repository
        return;
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

        if (stack.user._id !== user._id) {
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
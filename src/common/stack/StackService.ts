import { Service } from 'typedi';

import { Stack } from './Stack';
import { IUser } from '../../model/user/model/IUser-types';
import { StackRepository } from '../../model/db/StackRepository';

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
            throw new Error(`stack ${stack.id} is signed`);
        }
        stack = new Stack(await this.stackRepository.insertOrUpdate(stack));
        return stack;
    }

    public async remove(stack: Stack, user: IUser): Promise<void> {
        return;
    }

    public async getUserStackList(user: IUser): Promise<Stack[]> {
        return;
    }

    public async get(stackId: Stack, user: IUser): Promise<Stack> {
        return;
    }

    public async makeSigned(stack: Stack, user: IUser): Promise<Stack> {
        return;
    }
}
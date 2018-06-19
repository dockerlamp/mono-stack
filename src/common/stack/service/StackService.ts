import { Service } from 'typedi';
import * as _ from 'lodash';

import { Stack } from './../Stack';
import { ILoginUser } from '../../../../src/model/user/service/ILoginUser';
import { StackRepository } from '../../../model/db/StackRepository';
import { UserModel } from '../../../../src/model/user/model/UserModel';

@Service()
export class StackService {

    constructor(private stackRepository: StackRepository,
                private userModel: UserModel) {}

    public async add(stack: Stack, user: ILoginUser): Promise<Stack> {
        this.checkIfSigned(stack);
        await this.checkOwnership(stack, user);
        stack = new Stack(await this.stackRepository.insertOrUpdate(stack));
        return stack;
    }

    public async addAnonymous(stack: Stack): Promise<Stack> {
        this.checkIfAnonymous(stack);
        stack = new Stack(await this.stackRepository.insertOrUpdate(stack));
        return stack;
    }

    public async remove(stack: Stack, user: ILoginUser): Promise<string> {
        this.checkIfSigned(stack);
        await this.checkOwnership(stack, user);
        return await this.stackRepository.delete(stack);
    }

    public async removeAnonymous(stack: Stack): Promise<string> {
        this.checkIfAnonymous(stack);
        return await this.stackRepository.delete(stack);
    }

    public async getUserStackList(user: ILoginUser): Promise<Stack[]> {
        // @ TODO not implemented in repository
        return;
    }

    public async get(stackId: string, user: ILoginUser): Promise<Stack> {
        let stack = new Stack(await this.stackRepository.getById(stackId));
        this.checkIfSigned(stack);
        await this.checkOwnership(stack, user);
        return stack;
    }

    public async getAnonymous(stackId: string): Promise<Stack> {
        let stack = new Stack(await this.stackRepository.getById(stackId));
        this.checkIfAnonymous(stack);
        return stack;
    }

    public async makeSigned(stack: Stack, user: ILoginUser): Promise<Stack> {
        if (stack.userId) {
            throw new Error(`stack ${stack.id} is already signed`);
        }
        let userId = await this.getUserId(user);
        stack.userId = userId;
        return stack;
    }

    private async getUserId(user: ILoginUser): Promise<string> {
        let dbUser = await this.userModel.getUserByProvider(user.provider, user.providerUserId);
        return dbUser.id;
    }

    private async checkOwnership(stack: Stack, user: ILoginUser): Promise<void> {
        let userId = await this.getUserId(user);
        if (stack.userId !== userId) { throw new Error(`user ${user.userName} is not the owner of stack ${stack.id}`); }
    }

    private checkIfSigned(stack: Stack): void {
        if (!stack.userId) {
            throw new Error(`stack ${stack.id} is anonymous, signed stack required`);
        }
    }

    private checkIfAnonymous(stack: Stack): void {
        if (stack.userId) {
            throw new Error(`stack ${stack.id} is signed, anonymous stack required`);
        }
    }

}
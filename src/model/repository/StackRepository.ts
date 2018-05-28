import { Service } from 'typedi';
import * as winston from 'winston';

import { Logger } from '../../common/logger/Logger';
import { Stack } from '../../common/stack/Stack';
import { IStackDb } from '../../model/db/IStackDb';
import { MongoStackDbFactory } from '../../model/db/MongoStackDbFactory';
import { Error } from 'mongoose';

// @TODO make common interface for all repositories?
@Service()
export class StackRepository {
    // @TODO use as cache (collection) for stack instances?
    private stackCollection: Stack[];

    private dbContext: IStackDb;

    constructor(
        private mongoStackDbFactory: MongoStackDbFactory,
        @Logger() private logger: winston.Logger) {
        this.dbContext = this.mongoStackDbFactory.create();
    }

    public async add(stack: Stack): Promise<void> {
        await this.dbContext.insertOrUpdateComponent(stack);
    }

    public async findbyId(stackId: string): Promise<Stack> {
        let component = await this.dbContext.getComponentById(stackId);
        return new Stack(component);
    }
}
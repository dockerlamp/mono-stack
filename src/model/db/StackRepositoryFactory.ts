import { Service } from 'typedi';
import * as winston from 'winston';

import { StackRepository } from './StackRepository';
import { MongoConnection } from './MongoConnection';

@Service()
export class StackRepositoryFactory {
    constructor(private mongoConnection: MongoConnection) {}

    public create() {
        return new StackRepository(this.mongoConnection.getConnection());
    }
}
import { Service } from 'typedi';
import * as winston from 'winston';

import { Logger } from '../../common/logger/Logger';
import { MongoStackDb } from './MongoStackDb';
import { MongoConnection } from './MongoConnection';

@Service()
export class MongoStackDbFactory {
    constructor(
        private mongoConnection: MongoConnection,
        @Logger() private logger: winston.Logger,
    ) {
    }

    public create() {
        return new MongoStackDb(this.mongoConnection.getConnection(), this.logger);
    }
}
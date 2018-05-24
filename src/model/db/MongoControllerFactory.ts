import { Service } from 'typedi';
import * as winston from 'winston';

import { Logger } from '../../common/logger/Logger';
import { MongoController } from './MongoController';
import { MongoConnection } from './MongoConnection';

@Service()
export class MongoControllerFactory {
    constructor(
        private mongoConnection: MongoConnection,
        @Logger() private logger: winston.Logger,
    ) {
    }

    public create() {
        return new MongoController(this.mongoConnection.getConnection(), this.logger);
    }
}
import { Service } from 'typedi';
import * as winston from 'winston';

import { UserModel } from './UserModel';
import { MongoConnection } from '../../db/MongoConnection';
import { Logger } from '../../../common/logger/Logger';

@Service()
export class UserModelFactory {
    constructor(
        private mongoConnection: MongoConnection,
        @Logger() private logger: winston.Logger,
    ) {
    }

    public create() {
        return new UserModel(this.mongoConnection.getConnection(), this.logger);
    }
}
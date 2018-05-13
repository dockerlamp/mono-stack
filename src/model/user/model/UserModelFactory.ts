import { Service } from 'typedi';

import { UserModel } from './UserModel';
import { MongoConnection } from '../../db/MongoConnection';
import { Logger } from '../../../common/logger/Logger';

@Service()
export class UserModelFactory {
    constructor(
        private mongoConnection: MongoConnection,
        private logging: Logger,
    ) {
    }

    public create() {
        return new UserModel(this.mongoConnection.getConnection(), this.logging);
    }
}
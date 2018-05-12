import { Service } from 'typedi';

import { UserModel } from './UserModel';
import { MongoConnection } from '../../db/MongoConnection';

@Service()
export class UserModelFactory {
    constructor(private mongoConnection: MongoConnection) {
    }

    public create() {
        return new UserModel(this.mongoConnection.getConnection());
    }
}
import { Service } from 'typedi';

import { UserModel } from './UserModel';
import { MongoConnection } from '../../db/MongoConnection';
import { EventBus } from '../../command-bus/EventBus';

@Service()
export class UserModelFactory {
    constructor(private mongoConnection: MongoConnection, private eventBus: EventBus) {
    }

    public create() {
        return new UserModel(this.mongoConnection.getConnection(), this.eventBus);
    }

}
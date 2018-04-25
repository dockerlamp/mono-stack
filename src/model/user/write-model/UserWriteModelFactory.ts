import { Service } from 'typedi';

import { UserWriteModel } from './UserWriteModel';
import { MongoConnection } from '../../db/MongoConnection';
import { EventBus } from '../../command-bus/EventBus';

@Service()
export class UserWriteModelFactory {
    constructor(private mongoConnection: MongoConnection, private eventBus: EventBus) {
    }

    public create() {
        return new UserWriteModel(this.mongoConnection.getConnection(), this.eventBus);
    }

}
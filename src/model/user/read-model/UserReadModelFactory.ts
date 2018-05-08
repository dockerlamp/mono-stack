import { Service } from 'typedi';

import { UserReadModel } from './UserReadModel';
import { EventBus } from '../../command-bus/EventBus';
import { UserWriteModel } from '../write-model/UserWriteModel';

@Service()
export class UserReadModelFactory {
    constructor(private userWriteModel: UserWriteModel, private eventBus: EventBus) {
    }

    public create() {
        return new UserReadModel(this.eventBus, this.userWriteModel);
    }

}
import { EventEmitter } from 'events';
import { IWriteModelUser } from '../write-model/types';
import { UserWriteModel } from '../write-model/UserWriteModel';

/**
 * Create read model using write model events
 */
export class UserReadModel extends EventEmitter {

    constructor(private userWriteModel: UserWriteModel) {
        super();
        this.userWriteModel.on('updated', (user: IWriteModelUser) => {
            this.denormalizeUser(user);
        });
    }

    // @TODO missing return type
    public async getUserByProvider(provider: string, providerUserId: string): Promise<any> {
        // @TODO create real "read model" without dependency of WriteModel
        return await this.userWriteModel.getUser(provider, providerUserId);
    }

    private denormalizeUser(user: IWriteModelUser) {
        // throw new Error('Method not implemented.');
    }
}

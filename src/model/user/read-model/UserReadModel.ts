import { IWriteModelUser } from '../write-model/types';
import { EventBus } from '../../command-bus/EventBus';
import { ICommand } from '../../command-bus/ICommand';
import { IUserRead } from '../write-model/IUserRead';

/**
 * Create read model using write model events
 */
export class UserReadModel {

    constructor(private eventBus: EventBus, private userRead: IUserRead) {
        eventBus.subscribe( {
            name: 'write-user-updated',
            handle: async (event: ICommand) => {
                this.denormalizeUser(event.payload);
            }
        });
    }

    // @TODO missing return type
    public async getUserByProvider(provider: string, providerUserId: string): Promise<any> {
        // @TODO create real "read model" without dependency of WriteModel
        return await this.userRead.getUserByProvider(provider, providerUserId);
    }

    private denormalizeUser(user: IWriteModelUser) {
        // @TODO Method not implemented
    }
}

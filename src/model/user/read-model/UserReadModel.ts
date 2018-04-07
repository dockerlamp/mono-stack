import { IWriteModelUser } from '../write-model/types';
import { EventBus } from '../../command-bus/EventBus';
import { ICommand } from '../../command-bus/ICommand';

/**
 * Create read model using write model events
 */
export class UserReadModel {

    constructor(private eventBus: EventBus) {
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
        throw new Error('Not implemented');
        // return await this.userWriteModel.getUser(provider, providerUserId);
    }

    private denormalizeUser(user: IWriteModelUser) {
        console.log('Denormalize user', user);
        // throw new Error('Method not implemented.');
    }
}

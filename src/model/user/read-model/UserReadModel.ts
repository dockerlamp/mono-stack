import { Service } from 'typedi';

import { IWriteModelUser } from '../write-model/types';
import { EventBus } from '../../command-bus/EventBus';
import { ICommand } from '../../command-bus/ICommand';
import { IUserRead } from '../write-model/IUserRead';
import { UserReadModelFactory } from './UserReadModelFactory';

/**
 * Create read model using write model events
 */
@Service({ factory: [UserReadModelFactory, 'create']})
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

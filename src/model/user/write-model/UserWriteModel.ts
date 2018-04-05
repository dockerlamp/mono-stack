import * as _ from 'lodash';
import * as uuid from 'uuid';
import { EventEmitter } from 'events';
import { Connection, Model } from 'mongoose';

import { ILoginUser } from '../command/ILoginUser';
import { IWriteModelUser, WriteModelUserSchema, IWriteModelUserDocument } from './types';
import { EventBus } from '../../command-bus/EventBus';

const USER_COLLECTION = 'write-user';
export class UserWriteModel extends EventEmitter {
    private model: Model<IWriteModelUserDocument>;

    constructor( private connection: Connection, private eventBus: EventBus ) {
        super();

        this.model = connection.model(USER_COLLECTION, WriteModelUserSchema);
    }

    public async saveUser(userData: ILoginUser): Promise<IWriteModelUserDocument> {
        let userWithoutIdentifiers = _.omit(userData, [ 'provider', 'providerUserId' ]);
        let user = await this.model.findOneAndUpdate(
            {
                [`providerIds.${userData.provider}`]: userData.providerUserId,
            },
            {
                $set: userWithoutIdentifiers,
            },
            {
                upsert: true,
                new: true,
            }
        );
        this.emit('updated', user);
        this.eventBus.publish({
            id: uuid.v4(),
            name: 'write-user-updated',
        });

        return user;
    }

    public async getUser(provider: string, providerUserId: string): Promise<IWriteModelUserDocument> {
        return await this.model.findOne({
            [`providerIds.${provider}`]: providerUserId,
        });
    }

}
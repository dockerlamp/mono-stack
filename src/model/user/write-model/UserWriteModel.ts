import * as _ from 'lodash';
import * as uuid from 'uuid';
import { EventEmitter } from 'events';
import { Connection, Model } from 'mongoose';

import { ILoginUser } from '../command/ILoginUser';
import { IWriteModelUser, WriteModelUserSchema, IWriteModelUserDocument } from './types';

export class UserWriteModel extends EventEmitter {
    private model: Model<IWriteModelUserDocument>;

    constructor( private connection: Connection ) {
        super();

        this.model = connection.model('write-user', WriteModelUserSchema);
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

        return user;
    }

    public async getUser(provider: string, providerUserId: string): Promise<IWriteModelUserDocument> {
        return await this.model.findOne({
            [`providerIds.${provider}`]: providerUserId,
        });
    }

}
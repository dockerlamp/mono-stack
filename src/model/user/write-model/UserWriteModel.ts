import { Service } from 'typedi';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { EventEmitter } from 'events';
import { Connection, Model } from 'mongoose';

import { ILoginUser } from '../command/ILoginUser';
import { IWriteModelUser, WriteModelUserSchema, IWriteModelUserDocument } from './types';
import { EventBus } from '../../command-bus/EventBus';
import { IUserWrite } from './IUserWrite';
import { IUserRead } from './IUserRead';
import { UserWriteModelFactory } from './UserWriteModelFactory';

const USER_COLLECTION = 'write-user';

@Service({ factory: [UserWriteModelFactory, 'create']})
export class UserWriteModel implements IUserWrite, IUserRead {
    private model: Model<IWriteModelUserDocument>;

    constructor( private connection: Connection, private eventBus: EventBus ) {
        this.model = connection.model(USER_COLLECTION, WriteModelUserSchema);
        this.model.schema.post('save', function() {
            eventBus.publish({
                id: uuid.v4(),
                name: 'write-user-updated',
                payload: this,
            });
        });
    }

    public async insertUser(userData: ILoginUser): Promise<IWriteModelUserDocument> {
        console.log('Saving user', userData);
        let writeModelUser = _.omit(userData, [ 'provider', 'providerUserId' ]) as IWriteModelUser;
        _.set(writeModelUser, ['providerIds', userData.provider], userData.providerUserId);
        let user = await this.model.create(writeModelUser);

        return user;
    }

    public async getUserByProvider(provider: string, providerUserId: string): Promise<IWriteModelUserDocument> {
        return await this.model.findOne({
            [`providerIds.${provider}`]: providerUserId,
        });
    }

    public async getUseByEmail(email: string): Promise<IWriteModelUserDocument> {
        return await this.model.findOne({ email });
    }

}
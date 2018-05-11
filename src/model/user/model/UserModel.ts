import { Service } from 'typedi';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { EventEmitter } from 'events';
import { Connection, Model } from 'mongoose';

import { ILoginUser } from '../service/ILoginUser';
import { IUser, UserSchema, IUserDocument } from './IUser-types';
import { EventBus } from '../../command-bus/EventBus';
import { IUserWrite } from './IUserWrite';
import { IUserRead } from './IUserRead';
import { UserModelFactory } from './UserModelFactory';

const USER_COLLECTION = 'user';

@Service({ factory: [UserModelFactory, 'create']})
export class UserModel implements IUserWrite, IUserRead {
    private model: Model<IUserDocument>;

    constructor( private connection: Connection, private eventBus: EventBus ) {
        this.model = connection.model(USER_COLLECTION, UserSchema);
        this.model.schema.post('save', function() {
            eventBus.publish({
                id: uuid.v4(),
                name: 'write-user-updated',
                payload: this,
            });
        });
    }

    public async insertUser(userData: ILoginUser): Promise<IUserDocument> {
        console.log('Saving user', userData);
        let writeModelUser = _.omit(userData, [ 'provider', 'providerUserId' ]) as IUser;
        _.set(writeModelUser, ['providerIds', userData.provider], userData.providerUserId);
        let user = await this.model.create(writeModelUser);

        return user;
    }

    public async getUserByProvider(provider: string, providerUserId: string): Promise<IUserDocument> {
        return await this.model.findOne({
            [`providerIds.${provider}`]: providerUserId,
        });
    }

    public async getUseByEmail(email: string): Promise<IUserDocument> {
        return await this.model.findOne({ email });
    }

}
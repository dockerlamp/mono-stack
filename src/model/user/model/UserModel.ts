import { Service } from 'typedi';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { Connection, Model } from 'mongoose';

import { ILoginUser } from '../service/ILoginUser';
import { IUser, UserSchema, IUserDocument } from './IUser-types';
import { IUserWrite } from './IUserWrite';
import { IUserRead } from './IUserRead';
import { UserModelFactory } from './UserModelFactory';
import { Logger } from '../../../common/logger/Logger';

export const USER_COLLECTION = 'user';

@Service({ factory: [UserModelFactory, 'create']})
export class UserModel implements IUserWrite, IUserRead {
    private model: Model<IUserDocument>;
    private logger;

    constructor(
        private connection: Connection,
        private logging: Logger,
     ) {
        this.model = connection.model(USER_COLLECTION, UserSchema, USER_COLLECTION);
        this.logger = this.logging.getLogger();
    }

    public async insertUser(userData: ILoginUser): Promise<IUserDocument> {
        this.logger.info('Saving user', userData);
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
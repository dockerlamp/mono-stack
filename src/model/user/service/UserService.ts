import { Service } from 'typedi';
import * as _ from 'lodash';

import { UserModel } from '../model/UserModel';
import { ILoginUser } from './ILoginUser';
import { IUserDocument, IUser } from '../model/IUser-types';

@Service()
export class UserService {
    constructor(private userModel: UserModel) { }

    public async login(loginUser: ILoginUser): Promise<IUser> {
        let user = await this.findLoginUser(loginUser);
        if (user) {
            // if exist then update only fields which does not exists in user
            return await this.updateUserUndefinedFields(user, loginUser);
        } else {
            // if doesnt exists add new user
            return await this.userModel.insertUser(loginUser);
        }
    }

    public async getUserByProvider(provider: string, providerUserId: string): Promise<IUser> {
        return await this.userModel.getUserByProvider(provider, providerUserId);
    }

    private async findLoginUser(loginUser: ILoginUser): Promise<IUserDocument> {
        let {provider, providerUserId, email} = loginUser;
        // get user by provider id
        let user = await this.userModel.getUserByProvider(provider, providerUserId);
        if (!user && email) {
            // get user by email
            user = await this.userModel.getUseByEmail(email);
        }

        return user;
    }

    private async updateUserUndefinedFields(user: IUserDocument, loginPayload: ILoginUser): Promise<IUserDocument> {
        let updateData = {};
        let compareFields = {
            firstName: loginPayload.firstName,
            lastName: loginPayload.lastName,
            userName: loginPayload.userName,
            displayName: loginPayload.displayName,
            [`providerIds.${loginPayload.provider}`]: loginPayload.providerUserId,
        };
        _.each(compareFields, (newValue, path) => {
            let prevValue = _.get(user, path);
            // empty old value can be updated with non-empty new value
            if (_.isUndefined(prevValue) && !_.isUndefined(newValue)) {
                _.set(user, path, newValue);
            }
        });
        if (user.isModified) {
            await user.save();
        }

        return user;
    }
}
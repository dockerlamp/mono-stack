import { Service } from 'typedi';
import * as _ from 'lodash';

import { UserModel } from '../model/UserModel';
import { ILoginUser } from './ILoginUser';
import { IUserDocument } from '../model/types';

@Service()
export class UserService {
    constructor(private userModel: UserModel) { }

    public async login(loginUser: ILoginUser) {
        let {provider, providerUserId, email} = loginUser;
        // get user by provider id
        let user = await this.userModel.getUserByProvider(provider, providerUserId);
        if (!user && email) {
            // get user by email
            user = await this.userModel.getUseByEmail(email);
        }
        if (user) {
            // if exist then update only fields which does not exists in user
            await this.updateUserUndefinedFields(user, loginUser);
        } else {
            // if doesnt exists add new user
            await this.userModel.insertUser(loginUser);
        }
    }

    private async updateUserUndefinedFields(user: IUserDocument, loginPayload: ILoginUser) {
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
    }
}
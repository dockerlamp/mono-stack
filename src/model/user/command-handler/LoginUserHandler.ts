import { Service } from 'typedi';
import * as _ from 'lodash';

import { ICommandHandler } from '../../command-bus/ICommandHandler';
import { UserModel } from '../model/UserModel';
import { LoginUserCommand } from '../command/LoginUser';
import { ILoginUserCommand } from '../command/ILoginUserCommand';
import { IWriteModelUserDocument } from '../model/types';
import { ILoginUser } from '../command/ILoginUser';

@Service()
export class LoginUserHandler implements ICommandHandler {
    public name: string = 'login-user';

    constructor(private userModel: UserModel) {
    }

    public async handle(command: ILoginUserCommand): Promise<void> {
        let {provider, providerUserId, email} = command.payload;
        // get user by provider id
        let user = await this.userModel.getUserByProvider(provider, providerUserId);
        if (!user && email) {
            // get user by email
            user = await this.userModel.getUseByEmail(email);
        }
        if (user) {
            // if exist then update only fields which does nod exists in user
            await this.updateUser(user, command.payload);
        } else {
            // if doesnt exists add new user
            await this.userModel.insertUser(command.payload);
        }
    }

    private async updateUser(user: IWriteModelUserDocument, loginPayload: ILoginUser) {
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